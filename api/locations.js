const connectToDatabase = require('./db');


module.exports = async (req, res) => {
  // Fungsi untuk set header CORS pada semua response
  function setCORSHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Expose-Headers', '*');
  }

  setCORSHeaders(res);

  if (req.method === 'OPTIONS') {
    setCORSHeaders(res);
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection('locations');

    if (req.method === 'GET') {
      const locations = await collection.find({}).toArray();
      setCORSHeaders(res);
      res.setHeader('Content-Type', 'application/json');
      res.status(200).end(JSON.stringify(locations));
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
      res.setHeader('Content-Type', 'application/json');
      res.status(201).end(JSON.stringify({ insertedId: result.insertedId }));
    } else {
      setCORSHeaders(res);
      res.setHeader('Content-Type', 'application/json');
      res.status(405).end(JSON.stringify({ message: 'Method not allowed' }));
    }
  } catch (err) {
    console.error(err);
    setCORSHeaders(res);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).end(JSON.stringify({ error: err.message }));
  }
};
