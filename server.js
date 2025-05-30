const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let nextId = 1;
let racers = Array.from({ length: 4 }, (_, i) => ({
  id: nextId++,
  name: `Driver ${i + 1}`,
  score: 0,
  position: i + 1,
  image: null
}));

// Upload configuration
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    const id = req.body.id;
    const ext = path.extname(file.originalname);
    cb(null, `driver_${id}${ext}`);
  }
});
const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
  const id = parseInt(req.body.id);
  const racer = racers.find(r => r.id === id);
  if (racer) {
    racer.image = `/uploads/${req.file.filename}`;
    broadcastRacers();
    res.status(200).send('Uploaded');
  } else {
    res.status(404).send('Racer not found');
  }
});

function broadcastRacers() {
  racers = racers
    .sort((a, b) => b.score - a.score)
    .map((r, i) => ({ ...r, position: i + 1 }));

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(racers));
    }
  });
}

wss.on('connection', ws => {
  ws.send(JSON.stringify(racers));

  ws.on('message', message => {
    const data = JSON.parse(message);
    const racer = racers.find(r => r.id === data.id);

    if (data.action === 'rename' && racer) {
      racer.name = data.newName;
    } else if (data.action === 'score' && racer) {
      racer.score = data.newScore;
    }

    broadcastRacers();
  });
});

app.use(express.json()); // Add this at the top with other middleware

app.post('/set-drivers', (req, res) => {
  const count = parseInt(req.body.count, 10);
  if (!Number.isInteger(count) || count < 1 || count > 16) {
    return res.status(400).send('Invalid driver count');
  }

  nextId = 1;
  racers = Array.from({ length: count }, (_, i) => ({
    id: nextId++,
    name: `Driver ${i + 1}`,
    score: 0,
    position: i + 1,
    image: null
  }));

  broadcastRacers();
  res.sendStatus(200);
});

app.use(express.static('public'));
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});