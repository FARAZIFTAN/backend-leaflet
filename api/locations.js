const connectToDatabase = require('./db');


module.exports = async (req, res) => {
  // Set CORS header wildcard agar semua origin diizinkan
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
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
      let data = req.body;
      // Parse body jika belum ter-parse (Vercel serverless function)
      if (!data || Object.keys(data).length === 0) {
        try {
          data = JSON.parse(req.body);
        } catch (e) {
          let body = '';
          await new Promise((resolve) => {
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', resolve);
          });
          data = JSON.parse(body);
        }
      }
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
