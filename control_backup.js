// public/control.js
const socket = new WebSocket(`ws://${location.host}`);
let racers = [];

socket.addEventListener('message', event => {
  racers = JSON.parse(event.data);
  renderRacerSelects();
});

function renderRacerSelects() {
  const select1 = document.getElementById('racerSelect');
  const select2 = document.getElementById('renameSelect');
  select1.innerHTML = '';
  select2.innerHTML = '';
  racers.forEach(racer => {
    const option1 = document.createElement('option');
    option1.value = racer.id;
    option1.textContent = racer.name;
    select1.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = racer.id;
    option2.textContent = racer.name;
    select2.appendChild(option2);
  });
}

document.getElementById('renameForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const id = parseInt(document.getElementById('renameSelect').value, 10);
  const newName = document.getElementById('newName').value.trim();
  if (newName) {
    socket.send(JSON.stringify({ action: 'rename', id, newName }));
  }
});

document.getElementById('positionForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const id = parseInt(document.getElementById('racerSelect').value, 10);
  const newScore = parseInt(document.getElementById('newScore').value, 10);
  socket.send(JSON.stringify({ action: 'score', id, newScore }));
});