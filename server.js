const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./api/db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/locations', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('locations');
    const locations = await collection.find({}).toArray();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/locations', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('locations');
    const result = await collection.insertOne(req.body);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});