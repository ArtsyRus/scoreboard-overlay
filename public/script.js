// public/script.js
const socket = new WebSocket(`ws://${location.host}`);
let racers = [];

socket.addEventListener('message', event => {
  racers = JSON.parse(event.data);
  renderRacers();
});

function renderRacers() {
  const container = document.getElementById('raceOverlay');
  container.innerHTML = '';
  racers.forEach(racer => {
    const div = document.createElement('div');
    div.className = 'racer';
    div.innerHTML = `
      <div class="racer-left">
        <div class="rhombus position-rhombus"><span>#${racer.position}</span></div>
          <img src="${racer.image || 'default.png'}" class="racer-icon" />
        </div>
        <span class="racer-name">${racer.name}</span>
      </div>
      <span class="racer-score">${racer.score}</span>
    `;
    container.appendChild(div);
  });
}
