(function () {
  // === 1. КОНСТАНТИ ТА ГЛОБАЛЬНІ ЗМІННІ ===
  // Всі змінні та функції живуть тільки всередині цієї (function () { ... })();
  // Вони не "засмічують" глобальний простір (window).

  // === Картинки для слотів ===
  const IMAGES = [
    "sticker1.webp",
    "sticker2.webp",
    "sticker3.webp",
    "sticker4.webp",
    "sticker5.webp",
    "sticker6.webp"
  ];

  // === Елементи DOM ===
  // "Захоплюємо" всі потрібні HTML-елементи один раз при завантаженні
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

  // === Стан гри ===
  // 'let' змінні, що відслідковують стан гри
  let spins = 0;
  let won = false;
  let winSpin = null;
  const MAX_SPINS = 3;

  // === 2. ОСНОВНА ЛОГІКА ГРИ ===

  /**
   * Головна функція обертання барабанів
   */
  async function spinAll() {
    // 1. ПЕРЕВІРКА ПЕРЕМОГИ (спрацює при кліку ПІСЛЯ виграшу)
    if (won) {
      alert(`🎉 Вітаємо, ${playerNameEl.textContent}! Ви вже виграли на ${winSpin}-й спробі!\nНатисніть «Repeat», щоб зіграти ще раз.`);
      return;
    }

    // 2. ПЕРЕВІРКА ПРОГРАШУ (спрацює на 4-й клік)
    if (spins >= MAX_SPINS) {
      alert("😿 3 спини завершено. Перемоги немає.\nНатисніть «Repeat», щоб спробувати знову.");
      return;
    }

    // 3. Перевірка, чи не йде обертання зараз
    if (spinBtn.disabled) return;

    // 4. Початок обертання
    spinBtn.disabled = true; // Блокуємо кнопку ТИМЧАСОВО на час анімації
    spins++;
    spinsEl.textContent = spins;
    clearHighlights(); // Викликаємо функцію очищення

    // 5. Логіка "Щасливого шансу" (20%)
    let forceWin = !won && Math.random() < 0.2;
    // Створюємо звичайну випадкову комбінацію
    let finalColumns = [pickDistinct(3), pickDistinct(3), pickDistinct(3)];

    if (forceWin) {
      // Якщо шанс спрацював, ПЕРЕЗАПИСУЄМО комбінацію на виграшну
      const winImage = IMAGES[Math.floor(Math.random() * IMAGES.length)];
      const winType = Math.floor(Math.random() * 2); // 0 = горизонталь, 1 = вертикаль
      const winLine = Math.floor(Math.random() * 3); // 0, 1, or 2

      if (winType === 0) { // Примусова горизонталь
        const row = winLine;
        finalColumns[0][row] = winImage;
        finalColumns[1][row] = winImage;
        finalColumns[2][row] = winImage;
      } else { // Примусова вертикаль
        const col = winLine;
        finalColumns[col] = pickDistinct(3); // Оновлюємо стовпчик
        finalColumns[col][0] = winImage;
        finalColumns[col][1] = winImage;
        finalColumns[col][2] = winImage;
      }
    }
    
    // 6. Запуск анімації обертання
    const durations = [1000, 1200, 1400];
    // 'await' чекає, поки всі Promise від 'spinReel' завершаться
    await Promise.all(finalColumns.map((col, i) => spinReel(i, col, durations[i])));

    // 7. Перевірка результату
    const winInfo = checkWin(finalColumns); // Викликаємо функцію перевірки
    const isWin = (winInfo !== null);

    if (isWin && !won) {
      won = true;
      winSpin = spins;
      spawnHearts(); // Викликаємо ефект
      highlightWin(winInfo); // Викликаємо підсвітку
    }

    // 8. Логіка завершення
    // Просто розблоковуємо кнопку. Всі перевірки відбудуться на початку наступного кліку.
    spinBtn.disabled = false;
  }

  /**
   * Скидання гри до початкового стану
   */
  function resetGame() {
    spins = 0;
    won = false;
    winSpin = null;
    spinsEl.textContent = 0;
    confettiContainer.innerHTML = "";
    clearHighlights();
    for (let i = 0; i < 3; i++) {
      setReel(i, pickDistinct(3));
    }
    spinBtn.disabled = false;
  }

  /**
   * Перевірка виграшних комбінацій
   * @returns {object|null} - Об'єкт з інформацією про виграш або null
   */
  function checkWin(columns) {
    // Горизонталь
    for (let row = 0; row < 3; row++) {
      if (columns[0][row] === columns[1][row] && columns[1][row] === columns[2][row]) {
        return { cells: [ [0, row], [1, row], [2, row] ] };
      }
    }
    // Вертикаль
    for (let col = 0; col < 3; col++) {
      if (columns[col][0] === columns[col][1] && columns[col][1] === columns[col][2]) {
        return { cells: [ [col, 0], [col, 1], [col, 2] ] };
      }
    }
    return null; // Немає виграшу
  }
  
  /**
   * Запитує ім'я гравця при завантаженні
   */
  function askName() {
    let name = prompt("Введіть ваше ім'я:", "").trim();
    if (!name) name = "Гість";
    playerNameEl.textContent = name;
  }

  // === 3. МЕХАНІКА ОБЕРТАННЯ ===

  /**
   * Вибирає N унікальних картинок з масиву IMAGES
   */
  function pickDistinct(n) {
    const arr = [...IMAGES]; // Копіюємо масив, щоб не змінювати оригінал
    const result = [];
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * arr.length);
      result.push(arr[idx]);
      arr.splice(idx, 1); // Видаляємо елемент, щоб він не повторився
    }
    return result;
  }

  /**
   * Встановлює фінальні картинки на один барабан
   */
  function setReel(index, imgs) {
    const imgsDom = reels[index].querySelectorAll("img");
    imgsDom.forEach((img, i) => (img.src = imgs[i]));
  }

  /**
   * Анімує обертання одного барабану
   */
  function spinReel(index, finalImgs, duration) {
    const imgsDom = reels[index].querySelectorAll("img");
    
    // Повертаємо Promise, щоб 'await' міг його чекати
    return new Promise(resolve => {
      // Ефект "тремтіння" під час прокрутки
      const interval = setInterval(() => {
        const randImgs = pickDistinct(3); // Беремо нові випадкові картинки
        imgsDom.forEach((img, i) => {
          img.src = randImgs[i];
          img.style.transform = `scale(${1 + Math.random() * 0.2}) rotate(${(Math.random() - 0.5) * 10}deg)`;
        });
      }, 100);

      // Зупинка анімації
      setTimeout(() => {
        clearInterval(interval); // Зупиняємо "тремтіння"
        setReel(index, finalImgs); // Ставимо фінальні картинки
        imgsDom.forEach(img => (img.style.transform = "scale(1)")); // Скидаємо стиль
        resolve(); // Сигнал, що Promise виконано
      }, duration);
    });
  }

  // === 4. ВІЗУАЛЬНІ ЕФЕКТИ ===
  
  /**
   * Підсвічує виграшні комірки
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
   * Очищує підсвічування з усіх комірок
   */
  function clearHighlights() {
    reels.forEach(reel => {
      reel.querySelectorAll("img").forEach(img => {
        img.style.backgroundColor = "transparent";
      });
    });
  }
  
  /**
   * Створює анімацію сердечок при виграші
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

  // === 5. ІНІЦІАЛІЗАЦІЯ ТА СЛУХАЧІ ===
  // Цей код виконується один раз при завантаженні сторінки

  askName(); // Запитуємо ім'я
  resetGame(); // Встановлюємо початкові картинки
  
  // Прив'язуємо функції до подій 'click'
  spinBtn.addEventListener("click", spinAll);
  resetBtn.addEventListener("click", resetGame);
  
})(); // Негайно викликаємо всю цю функцію
