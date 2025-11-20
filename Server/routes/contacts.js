const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all contacts (with optional search)
router.get('/', async (req, res) => {
  try {
    const q = req.query.q ? `%${req.query.q}%` : null;
    let sql = "SELECT * FROM Contacts";
    let params = [];

    if (q) {
      sql += " WHERE FullName LIKE ? OR Email LIKE ? OR Phone LIKE ?";
      params = [q, q, q];
    }

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM Contacts WHERE ContactId=?", [req.params.id]);
    res.json(rows[0] || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const { FullName, Email, Phone, Address, Notes } = req.body;
    const [result] = await pool.execute(
      "INSERT INTO Contacts (FullName, Email, Phone, Address, Notes) VALUES (?, ?, ?, ?, ?)",
      [FullName, Email, Phone, Address, Notes]
    );
    res.json({ insertedId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const { FullName, Email, Phone, Address, Notes } = req.body;
    await pool.execute(
      "UPDATE Contacts SET FullName=?, Email=?, Phone=?, Address=?, Notes=? WHERE ContactId=?",
      [FullName, Email, Phone, Address, Notes, req.params.id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await pool.execute("DELETE FROM Contacts WHERE ContactId=?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
