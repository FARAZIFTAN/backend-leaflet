const connectToDatabase = require('./db');


module.exports = async (req, res) => {
  // Fungsi untuk set header CORS
  function setCORSHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://faraziftan.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  setCORSHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection('locations');

    if (req.method === 'GET') {
      const locations = await collection.find({}).toArray();
      setCORSHeaders(res);
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
      setCORSHeaders(res);
      res.status(201).json({ insertedId: result.insertedId });
    } else {
      setCORSHeaders(res);
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (err) {
    console.error(err);
    setCORSHeaders(res);
    res.status(500).json({ error: err.message });
  }
};
