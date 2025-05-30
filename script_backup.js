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
    div.innerHTML = `<span>${racer.position}</span><span>${racer.name}</span><span>${racer.score}</span>`;
    container.appendChild(div);
  });
}

// let previousScores = {};

// function renderRacers() {
//   const container = document.getElementById('raceOverlay');
//   container.innerHTML = '';

//   racers.forEach(racer => {
//     const div = document.createElement('div');
//     div.className = 'racer';

//     // Top 3 coloring
//     if (racer.position === 1) {
//       div.style.background = 'gold';
//       div.style.color = 'black';
//       div.style.fontWeight = 'bold';
//     } else if (racer.position === 2) {
//       div.style.background = 'silver';
//       div.style.color = 'black';
//       div.style.fontWeight = 'bold';
//     } else if (racer.position === 3) {
//       div.style.background = '#cd7f32'; // bronze
//       div.style.color = 'black';
//       div.style.fontWeight = 'bold';
//     }

//     // Score span with optional animation
//     const scoreSpan = document.createElement('span');
//     scoreSpan.textContent = racer.score;
//     scoreSpan.className = 'score';

//     const previous = previousScores[racer.id];
//     if (previous !== undefined && previous !== racer.score) {
//       // Trigger animation
//       scoreSpan.classList.add(racer.score > previous ? 'score-up' : 'score-down');
//       setTimeout(() => {
//         scoreSpan.classList.remove('score-up', 'score-down');
//       }, 1000);
//     }

//     // Store current score for future comparison
//     previousScores[racer.id] = racer.score;

//     div.innerHTML = `<span>#${racer.position}</span><span>${racer.name}</span>`;
//     div.appendChild(scoreSpan);
//     container.appendChild(div);
//   });
// }