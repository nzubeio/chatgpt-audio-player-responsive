// ==UserScript==
// @name        Audio Player for ChatGPT (Responsive)
// @namespace   Violentmonkey Scripts
// @match       https://chatgpt.com/*
// @match       https://www.chatgpt.com/*
// @grant       none
// @version     0.0.0.2
// @author      Ian Speckart + Nzube
// @description https://github.com/nzubeio/chatgpt-audio-player-responsive
// ==/UserScript==

const closeBtn = document.createElement('button');

let checkInterval;
let currentPlayer = null;

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
  } else {
    startCheckingForAudioFile();
  }
});

if (document.hasFocus()) {
  startCheckingForAudioFile();
}

window.addEventListener('resize', () => {
  if (currentPlayer) {
    updatePlayerLayout(currentPlayer);
  }
});

function startCheckingForAudioFile() {
  if (!checkInterval) {
    checkInterval = setInterval(checkForAudioFile, 1000);
  }
}

function checkForAudioFile() {
  const audio = document.querySelector('audio');

  if (audio && !audio.paused) {
    showPlayer(audio);
  }
}

function showPlayer(player) {
  currentPlayer = player;

  player.style.display = 'block';
  closeBtn.style.display = 'block';

  player.controls = true;

  player.style.position = 'fixed';
  player.style.top = '9px';
  player.style.left = 'unset';
  player.style.bottom = 'unset';
  player.style.height = '38px';
  player.style.maxWidth = '100vw';
  player.style.zIndex = '999999';

  closeBtn.style.position = 'fixed';
  closeBtn.style.width = '20px';
  closeBtn.style.height = '20px';
  closeBtn.style.top = '19px';
  closeBtn.style.zIndex = '1000000';
  closeBtn.style.border = 'none';
  closeBtn.style.background = 'transparent';
  closeBtn.style.cursor = 'pointer';

  updatePlayerLayout(player);

  if (!closeBtn.dataset.ready) {
    closeBtn.appendChild(getExitIcon());
    closeBtn.addEventListener('click', () => hidePlayer(player));
    document.body.appendChild(closeBtn);
    closeBtn.dataset.ready = 'true';
  }
}

function updatePlayerLayout(player) {
  const screenWidth = window.innerWidth;

  const rightGap = screenWidth < 700 ? 16 : 180;
  const availableWidth = screenWidth - rightGap - 48;
  const playerWidth = Math.max(160, Math.min(500, availableWidth));

  player.style.width = `${playerWidth}px`;
  player.style.right = `${rightGap}px`;

  closeBtn.style.right = `${rightGap + playerWidth + 8}px`;
}

function hidePlayer(player) {
  player.style.display = 'none';
  closeBtn.style.display = 'none';

  player.pause();
}

function getExitIcon() {
  const container = document.createElement('div');
  container.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 1.61143L14.3886 0L8 6.38857L1.61143 0L0 1.61143L6.38857 8L0 14.3886L1.61143 16L8 9.61143L14.3886 16L16 14.3886L9.61143 8L16 1.61143Z" fill="#8F8F8F"/>
    </svg>
  `;

  return container.querySelector('svg');
}
