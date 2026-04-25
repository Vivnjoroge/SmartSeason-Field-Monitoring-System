// Field controller handling retrieval, creation, and agent updates.
const db = require('../config/db');
const { enrichFieldWithStatus } = require('../services/fieldService');

const VALID_STAGES = ['Planted', 'Growing', 'Ready', 'Harvested'];

const getLatestUpdateDate = async (fieldId) => {
  const latestUpdateResult = await db.query(
    'SELECT created_at FROM field_updates WHERE field_id = $1 ORDER BY created_at DESC LIMIT 1',
    [fieldId]
  );

  return latestUpdateResult.rows[0]?.created_at || null;
};

const getFields = async (req, res, next) => {
  try {
    let result;

    if (req.user.role === 'admin') {
      result = await db.query(
        `SELECT f.id, f.name, f.crop_type, f.planting_date, f.stage, f.agent_id, f.created_at, u.name AS agent_name
         FROM fields f
         LEFT JOIN users u ON f.agent_id = u.id
         ORDER BY f.created_at DESC`
      );
    } else {
      result = await db.query(
        `SELECT f.id, f.name, f.crop_type, f.planting_date, f.stage, f.agent_id, f.created_at, u.name AS agent_name
         FROM fields f
         LEFT JOIN users u ON f.agent_id = u.id
         WHERE f.agent_id = $1
         ORDER BY f.created_at DESC`,
        [req.user.id]
      );
    }

    const enrichedFields = await Promise.all(
      result.rows.map(async (field) => {
        const lastUpdateDate = await getLatestUpdateDate(field.id);
        return enrichFieldWithStatus(field, lastUpdateDate);
      })
    );

    return res.json(enrichedFields);
  } catch (error) {
    return next(error);
  }
};

const createField = async (req, res, next) => {
  try {
    const { name, crop_type, planting_date, stage = 'Planted', agent_id } = req.body;

    if (!name || !crop_type || !planting_date || !agent_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!VALID_STAGES.includes(stage)) {
      return res.status(400).json({ message: 'Invalid stage' });
    }

    // 1. Validate: Planting date cannot be in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(planting_date) > today) {
      return res.status(400).json({ message: 'Planting date cannot be in the future' });
    }

    // 2. Validate: Assigned user must exist and be an 'agent'
    const userResult = await db.query('SELECT role FROM users WHERE id = $1', [agent_id]);
    const assignedUser = userResult.rows[0];

    if (!assignedUser) {
      return res.status(400).json({ message: 'Assigned agent does not exist' });
    }

    if (assignedUser.role !== 'agent') {
      return res.status(400).json({ message: 'Fields can only be assigned to users with the Agent role' });
    }

    const result = await db.query(
      `INSERT INTO fields (name, crop_type, planting_date, stage, agent_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, crop_type, planting_date, stage, agent_id, created_at`,
      [name, crop_type, planting_date, stage, agent_id]
    );


    const field = result.rows[0];
    const enrichedField = enrichFieldWithStatus(field, null); // Last update date is null for new fields

    return res.status(201).json(enrichedField);
  } catch (error) {
    return next(error);
  }
};

const getFieldById = async (req, res, next) => {
  try {
    const fieldId = req.params.id;

    const fieldResult = await db.query(
      `SELECT f.id, f.name, f.crop_type, f.planting_date, f.stage, f.agent_id, f.created_at, u.name AS agent_name
       FROM fields f
       LEFT JOIN users u ON f.agent_id = u.id
       WHERE f.id = $1`,
      [fieldId]
    );

    const field = fieldResult.rows[0];
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }

    if (req.user.role === 'agent' && field.agent_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updatesResult = await db.query(
      `SELECT fu.id, fu.field_id, fu.agent_id, fu.stage, fu.note, fu.created_at, u.name AS agent_name
       FROM field_updates fu
       LEFT JOIN users u ON fu.agent_id = u.id
       WHERE fu.field_id = $1
       ORDER BY fu.created_at DESC`,
      [fieldId]
    );

    const lastUpdateDate = updatesResult.rows[0]?.created_at || null;
    const enrichedField = enrichFieldWithStatus(field, lastUpdateDate);

    return res.json({
      ...enrichedField,
      updates: updatesResult.rows,
    });
  } catch (error) {
    return next(error);
  }
};

const updateStage = async (req, res, next) => {
  try {
    const fieldId = req.params.id;
    const { stage } = req.body;

    if (!VALID_STAGES.includes(stage)) {
      return res.status(400).json({ message: 'Invalid stage' });
    }

    const ownershipResult = await db.query(
      'SELECT id, agent_id FROM fields WHERE id = $1',
      [fieldId]
    );

    const field = ownershipResult.rows[0];
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }

    if (field.agent_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updatedFieldResult = await db.query(
      `UPDATE fields
       SET stage = $1
       WHERE id = $2
       RETURNING id, name, crop_type, planting_date, stage, agent_id, created_at`,
      [stage, fieldId]
    );

    await db.query(
      `INSERT INTO field_updates (field_id, agent_id, stage, note)
       VALUES ($1, $2, $3, $4)`,
      [fieldId, req.user.id, stage, null]
    );

    const updatedField = updatedFieldResult.rows[0];
    const enrichedField = enrichFieldWithStatus(updatedField, new Date());

    return res.json(enrichedField);
  } catch (error) {
    return next(error);
  }
};

const addNote = async (req, res, next) => {
  try {
    const fieldId = req.params.id;
    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({ message: 'Note is required' });
    }

    if (note.length > 1000) {
      return res.status(400).json({ message: 'Note is too long (max 1000 characters)' });
    }


    const ownershipResult = await db.query(
      'SELECT id, agent_id FROM fields WHERE id = $1',
      [fieldId]
    );

    const field = ownershipResult.rows[0];
    if (!field) {
      return res.status(404).json({ message: 'Field not found' });
    }

    if (field.agent_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updateResult = await db.query(
      `INSERT INTO field_updates (field_id, agent_id, stage, note)
       VALUES ($1, $2, $3, $4)
       RETURNING id, field_id, agent_id, stage, note, created_at`,
      [fieldId, req.user.id, null, note.trim()]
    );

    return res.status(201).json(updateResult.rows[0]);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getFields,
  createField,
  getFieldById,
  updateStage,
  addNote,
};
