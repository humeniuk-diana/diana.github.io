// === 1. ПОЛУЧЕНИЕ ЭЛЕМЕНТОВ DOM ===
// (В стиле кода 2: все переменные для HTML-элементов объявляются в глобальной области)
const reels = [
  document.getElementById('dep0'),
  document.getElementById('dep1'),
  document.getElementById('dep2')
];
const spinBtn = document.getElementById('spin');
const resetBtn = document.getElementById('repeat');
const spinsEl = document.getElementById('spins');
const playerNameEl = document.getElementById('playerName');
const confettiContainer = document.getElementById('confetti');

// === 2. КОНСТАНТЫ И СОСТОЯНИЕ ИГРЫ ===
// (В стиле кода 2: все константы и переменные 'let' также в глобальной области)
const IMAGES = [
  "sticker1.webp",
  "sticker2.webp",
  "sticker3.webp",
  "sticker4.webp",
  "sticker5.webp",
  "sticker6.webp"
];
const MAX_SPINS = 3;

let spins = 0;
let won = false;
let winSpin = null;

// === 3. ОПРЕДЕЛЕНИЕ ВСЕХ ФУНКЦИЙ ===
// (В стиле кода 2: все функции объявлены в глобальной области)

/**
 * Главная функция вращения барабанов
 */
async function spinAll() {
  // 1. ПРОВЕРКА ПОБЕДЫ (сработает при клике ПОСЛЕ выигрыша)
  if (won) {
    alert(`🎉 Вітаємо, ${playerNameEl.textContent}! Ви вже виграли на ${winSpin}-й спробі!\nНатисніть «Repeat», щоб зіграти ще раз.`);
    return;
  }

  // 2. ПРОВЕРКА ПРОИГРЫША (сработает на 4-й клик)
  if (spins >= MAX_SPINS) {
    alert("😿 3 спини завершено. Перемоги немає.\nНатисніть «Repeat», щоб спробувати знову.");
    return;
  }

  // 3. Проверка, не идет ли вращение сейчас
  if (spinBtn.disabled) return;

  // 4. Начало вращения
  spinBtn.disabled = true; // Блокируем кнопку ВРЕМЕННО на время анимации
  spins++;
  spinsEl.textContent = spins;
  clearHighlights();

  // 5. Логика "Счастливого шанса" (20%)
  let forceWin = !won && Math.random() < 0.2;
  let finalColumns = [pickDistinct(3), pickDistinct(3), pickDistinct(3)];

  if (forceWin) {
    const winImage = IMAGES[Math.floor(Math.random() * IMAGES.length)];
    const winType = Math.floor(Math.random() * 2); // 0 = горизонталь, 1 = вертикаль
    const winLine = Math.floor(Math.random() * 3); // 0, 1, or 2

    if (winType === 0) {
      // Принудительная горизонтальная победа
      const row = winLine;
      finalColumns[0][row] = winImage;
      finalColumns[1][row] = winImage;
      finalColumns[2][row] = winImage;
    } else {
      // Принудительная вертикальная победа
      const col = winLine;
      finalColumns[col] = pickDistinct(3);
      finalColumns[col][0] = winImage;
      finalColumns[col][1] = winImage;
      finalColumns[col][2] = winImage;
    }
  } else {
    // Обычная генерация (уже сделана)
  }

  // 6. Запуск анимации вращения
  const durations = [1000, 1200, 1400];
  await Promise.all(finalColumns.map((col, i) => spinReel(i, col, durations[i])));

  // 7. Проверка результата
  const winInfo = checkWin(finalColumns);
  const isWin = (winInfo !== null);

  if (isWin && !won) {
    won = true;
    winSpin = spins;
    spawnHearts();
    highlightWin(winInfo);
  }

  // 8. Логика завершения (ПОСЛЕ прокрутки)
  // Разблокируем кнопку.
  spinBtn.disabled = false;
}

/**
 * Сброс игры в начальное состояние
 */
function resetGame() {
  spins = 0;
  won = false;
  winSpin = null;
  spinsEl.textContent = 0;
  confettiContainer.innerHTML = "";
  clearHighlights();
  for (let i = 0; i < 3; i++) setReel(i, pickDistinct(3));
  spinBtn.disabled = false;
}

/**
 * Проверка выигрышных комбинаций
 * @returns {object|null} - Объект с информацией о выигрыше или null
 */
function checkWin(columns) {
  // Горизонталь
  for (let row = 0; row < 3; row++) {
    if (columns[0][row] === columns[1][row] && columns[1][row] === columns[2][row]) {
      return { cells: [[0, row], [1, row], [2, row]] };
    }
  }
  // Вертикаль
  for (let col = 0; col < 3; col++) {
    if (columns[col][0] === columns[col][1] && columns[col][1] === columns[col][2]) {
      return { cells: [[col, 0], [col, 1], [col, 2]] };
    }
  }
  return null; // Нет выигрыша
}

/**
 * Запрашивает имя игрока при загрузке
 */
function askName() {
  let name = prompt("Введіть ваше ім'я:", "").trim();
  if (!name) name = "Гість";
  playerNameEl.textContent = name;
}

/**
 * Выбирает N уникальных картинок из массива IMAGES
 */
function pickDistinct(n) {
  const arr = [...IMAGES];
  const result = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * arr.length);
    result.push(arr[idx]);
    arr.splice(idx, 1);
  }
  return result;
}

/**
 * Устанавливает финальные картинки на один барабан
 */
function setReel(index, imgs) {
  const imgsDom = reels[index].querySelectorAll("img");
  imgsDom.forEach((img, i) => (img.src = imgs[i]));
}

/**
 * Анимирует вращение одного барабана
 */
function spinReel(index, finalImgs, duration) {
  const imgsDom = reels[index].querySelectorAll("img");
  return new Promise(resolve => {
    const interval = setInterval(() => {
      const randImgs = pickDistinct(3);
      imgsDom.forEach((img, i) => {
        img.src = randImgs[i];
        img.style.transform = `scale(${1 + Math.random() * 0.2}) rotate(${(Math.random() - 0.5) * 10}deg)`;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setReel(index, finalImgs);
      imgsDom.forEach(img => (img.style.transform = "scale(1)"));
      resolve();
    }, duration);
  });
}

/**
 * Подсвечивает выигрышные ячейки
 */
function highlightWin(winInfo) {
  if (!winInfo) return;

  winInfo.cells.forEach(([col, row]) => {
    const imgEl = reels[col].querySelectorAll("img")[row];
    if (imgEl) {
      imgEl.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
      imgEl.style.borderRadius = "10px";
      imgEl.style.transition = "background-color 0.3s ease";
    }
  });
}

/**
 * Очищает подсветку со всех ячеек
 */
function clearHighlights() {
  reels.forEach(reel => {
    reel.querySelectorAll("img").forEach(img => {
      img.style.backgroundColor = "transparent";
    });
  });
}

/**
 * Создает анимацию сердечек при выигрыше
 */
function spawnHearts() {
  for (let i = 0; i < 60; i++) {
    const heart = document.createElement("div");
    heart.textContent = "❤️";
    heart.style.position = "fixed";
    heart.style.left = Math.random() * 100 + "%";
    heart.style.top = "-10px";
    heart.style.fontSize = (16 + Math.random() * 14) + "px";
    heart.style.opacity = 0.9;
    heart.style.animation = `fall ${2 + Math.random() * 3}s linear`;
    confettiContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 4000);
  }
}

// === 4. ИНИЦИАЛИЗАЦИЯ И СЛУШАТЕЛИ ===
// (В стиле кода 2: слушатели и запуск игры в самом конце)

spinBtn.addEventListener("click", spinAll);
resetBtn.addEventListener("click", resetGame);

// === 5. ЗАПУСК ИГРЫ ===
askName();
resetGame();
