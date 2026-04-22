// User controller for admin-managed agent listing endpoints.
const db = require('../config/db');

const getAgents = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT id, name, email
       FROM users
       WHERE role = $1
       ORDER BY name ASC`,
      ['agent']
    );

    return res.json(result.rows);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAgents,
};
