const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.post('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!', received: req.body });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
  console.log(`✅ Try: http://localhost:${PORT}/api/health`);
});