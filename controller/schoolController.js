const db = require('../util/database');
const { check, validationResult, query } = require('express-validator');

// POST: Add a new school
exports.postAddSchool = [
  check("schoolName")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Enter the full school name"),

  check("address")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Enter the full address"),

  check('latitute')
    .exists().withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),

  check('longitude')
    .exists().withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { schoolName, address, latitute, longitude } = req.body;

    const sql = `INSERT INTO schools (schoolName, address, latitute, longitude) VALUES (?, ?, ?, ?)`;

    try {
      await db.execute(sql, [schoolName, address, latitute, longitude]);
      res.status(201).json({ message: 'School added successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

// GET: Fetch schools sorted by proximity
exports.getSchoolList = [
  query("lat")
    .exists().withMessage("Latitute is required")
    .isFloat({ min: -90, max: 90 }).withMessage("Latitute must be between -90 and 90")
    .toFloat(),

  query("lng")
    .exists().withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 }).withMessage("Longitude must be between -180 and 180")
    .toFloat(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userLat = req.query.lat;
    const userLng = req.query.lng;

    const sql = `
      SELECT *, 
        (6371 * acos(
          cos(radians(?)) * cos(radians(latitute)) *
          cos(radians(longitude) - radians(?)) +
          sin(radians(?)) * sin(radians(latitute))
        )) AS distance
      FROM schools
      ORDER BY distance
    `;

    try {
      const [results] = await db.execute(sql, [userLat, userLng, userLat]);
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];
