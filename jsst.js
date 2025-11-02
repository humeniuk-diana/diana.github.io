const dep = [
  document.getElementById('dep0'),
  document.getElementById('dep1'),
  document.getElementById('dep2')
];
const spinBtn = document.getElementById('spin');
const repeatBtn = document.getElementById('repeat');
const spinsText = document.getElementById('spins');
const playerName = document.getElementById('playerName');
const confetti = document.getElementById('confetti');
const img = ["sticker1.webp", "sticker2.webp", "sticker3.webp", "sticker4.webp", "sticker5.webp", "sticker6.webp"];
const max = 3;
let spins = 0;
let won = false;
let winSpin = null;
const userName = prompt("Enter your name:") || "Diana";
playerName.textContent = userName
function randomImg(n) {
  const imgNew = [...img];
  const result = [];
  for (let i = 0; i < n; i++) {
    const index = Math.floor(Math.random() * imgNew.length);
    result.push(imgNew.splice(index, 1)[0]);
  }
  return result;
}
function update(index, images) {
  const imgs = dep[index].querySelectorAll("img");
  imgs.forEach((img, i) => (img.src = images[i]));
}
function animation(index, finalImages) {
  let steps = 15;
  let current = 0;
  const timer = setInterval(() => {
    update(index, randomImg(3));
    current++;
    if (current >= steps) {
      clearInterval(timer);
      update(index, finalImages);
    }
  }, 100);
}
function checkWin(columns) {
  for (let row = 0; row < 3; row++) {
    if (columns[0][row] === columns[1][row] && columns[1][row] === columns[2][row]) {
      return { cells: [[0, row], [1, row], [2, row]] };
    }
  }
  for (let col = 0; col < 3; col++) {
    if (columns[col][0] === columns[col][1] && columns[col][1] === columns[col][2]) {
      return { cells: [[col, 0], [col, 1], [col, 2]] };
    }
  }
  return null;
}
function light(cells) {
  cells.forEach(([col, row]) => {
    const img = dep[col].querySelectorAll("img")[row];
    img.style.backgroundColor = "rgba(255,255,255,0.5)";
    img.style.borderRadius = "10px";
  });
}
function clearlights() {
  dep.forEach(reel => {
    reel.querySelectorAll("img").forEach(img => img.style.backgroundColor = "transparent");
  });
}
function showHearts() {
  for (let i = 0; i < 50; i++) {
    const heart = document.createElement("div");
    heart.textContent = "❤️";
    heart.style.position = "fixed";
    heart.style.left = Math.random() * 100 + "%";
    heart.style.top = "-10px";
    heart.style.fontSize = (16 + Math.random() * 14) + "px";
    heart.style.animation = `fall ${2 + Math.random() * 3}s linear`;
    confetti.appendChild(heart);
    setTimeout(() => heart.remove(), 4000);
  }
}
function spinAll() {
  if (won) {
    alert(`🎉 You have already won on ${winSpin}th try! Click "Repeat" to play again.`);
    return;
  }
  if (spins >= max) {
    alert("😿 3 spins completed. No win.\nClick «Repeat» to try again.");
    return;
  }
  spinBtn.disabled = true;
  spins++;
  spinsText.textContent = spins;
  clearlights();
  let willWin = !won && Math.random() < 0.2;
  let rrImages = [randomImg(3), randomImg(3), randomImg(3)];
  if (willWin) {
    const winImage = img[Math.floor(Math.random() * img.length)];
    const oror = Math.random() < 0.5;
    if (oror) {
      const winRow = Math.floor(Math.random() * 3);
      rrImages[0][winRow] = winImage;
      rrImages[1][winRow] = winImage;
      rrImages[2][winRow] = winImage;
    } else {
      const winCol = Math.floor(Math.random() * 3);
      for (let row = 0; row < 3; row++) {
        rrImages[winCol][row] = winImage;
      }
    }
  }
    animation(0, rrImages[0]);
    animation(1, rrImages[1]);
    animation(2, rrImages[2]);
    setTimeout(() => {
      const win = checkWin(rrImages);
      if (win && !won) {
        won = true;
        winSpin = spins;
        light(win.cells);
        showHearts();
      }
      spinBtn.disabled = false;
    }, 1500);
  }
function resetGame() {
  spins = 0;
  won = false;
  winSpin = null;
  spinsText.textContent = 0;
  confetti.innerHTML = "";
  clearlights();
  for (let i = 0; i < 3; i++) update(i, randomImg(3));
  spinBtn.disabled = false;
}
spinBtn.addEventListener("click", spinAll);
repeatBtn.addEventListener("click", resetGame);