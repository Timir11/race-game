let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let player = document.getElementById('player');
let statusText = document.getElementById('statusText');

let previousFrame = null;
let position = 0;
let raceStarted = false;
let playerName = '';

function startGame() {
  playerName = document.getElementById('playerName').value || 'You';
  document.querySelector('.input-section').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');
  document.getElementById('statusText').innerText = `${playerName} is ready! Start moving in front of camera!`;
  startCamera();
  raceStarted = true;
}

function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    video.srcObject = stream;
    setInterval(checkMotion, 200);
  }).catch(err => {
    alert("Camera access denied.");
  });
}

function checkMotion() {
  if (!raceStarted) return;

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  let currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);

  if (previousFrame) {
    let diff = 0;
    for (let i = 0; i < currentFrame.data.length; i += 4) {
      diff += Math.abs(currentFrame.data[i] - previousFrame.data[i]); // red channel
    }

    if (diff > 1000000) { // basic motion threshold
      position += 10;
      if (position >= canvas.width - 100) {
        raceStarted = false;
        player.style.left = `${canvas.width - 100}px`;
        statusText.innerText = `${playerName} wins! 🎉`;
        return;
      }
      player.style.left = `${position}px`;
    }
  }

  previousFrame = currentFrame;
}

function restartGame() {
  window.location.reload();
}
