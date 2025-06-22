// public/control.js
const socket = new WebSocket(`ws://${location.host}`);
let racers = [];

socket.addEventListener('message', event => {
  racers = JSON.parse(event.data);
  renderRacerSelects();
});

function renderRacerSelects() {
  const selects = ['renameSelect', 'scoreSelect', 'imageSelect']; // REMOVE 'racerSelect'
  selects.forEach(id => {
    const select = document.getElementById(id);
    select.innerHTML = '';
    racers.forEach(racer => {
      const option = document.createElement('option');
      option.value = racer.id;
      option.textContent = racer.name;
      select.appendChild(option);
    });
  });
}

document.getElementById('resetForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const count = parseInt(document.getElementById('driverCount').value, 10);
  if (!isNaN(count) && count >= 1 && count <= 16) {
    fetch('/set-drivers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ count })
    }).then(res => {
      if (!res.ok) return alert('Failed to reset drivers');
      alert('Drivers reset');
    });
  }
});

// document.getElementById('uploadForm').addEventListener('submit', function (e) {
//   e.preventDefault();
//   const form = e.target;
//   const formData = new FormData();
//   const id = document.getElementById('imageSelect').value;
//   const file = form.querySelector('input[type="file"]').files[0];

//   formData.append('id', id);
//   formData.append('image', file);

//   fetch('/upload', {
//     method: 'POST',
//     body: formData
//   }).then(res => {
//     if (!res.ok) return alert('Upload failed');
//     alert('Image uploaded');
//   });
// });

document.getElementById('renameForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const id = parseInt(document.getElementById('renameSelect').value, 10);
  const newName = document.getElementById('newName').value.trim();
  if (newName) {
    socket.send(JSON.stringify({ action: 'rename', id, newName }));
  }
});

document.getElementById('scoreForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const id = parseInt(document.getElementById('scoreSelect').value, 10);
  const newScore = parseInt(document.getElementById('newScore').value, 10);
  if (!isNaN(newScore)) {
    socket.send(JSON.stringify({ action: 'score', id, newScore }));
  }
});


