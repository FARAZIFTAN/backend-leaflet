const connectToDatabase = require('./db');


module.exports = async (req, res) => {
  // Allow only the frontend domain
  res.setHeader('Access-Control-Allow-Origin', 'https://faraziftan.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    // Preflight request
    res.status(204).end();
    return;
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection('locations');

    if (req.method === 'GET') {
      const locations = await collection.find({}).toArray();
      res.status(200).json(locations);
    } else if (req.method === 'POST') {
      const data = req.body;
      const result = await collection.insertOne(data);
      res.status(201).json({ insertedId: result.insertedId });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
