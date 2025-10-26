const userrName = document.getElementById('user-name');
const user = document.getElementById('user');
const userNumber = document.getElementById('user-number');
const computer = document.getElementById('computer');
const computerNumber = document.getElementById('computer-number');
const generate = document.getElementById('generate');

const userName = prompt("Enter your name:") || "Diana";
userrName.textContent = userName;

let userScore = 0;
let computerScore = 0;
let round = 0;

const mast = ["hearts", "spades", "clubs", "diamonds"]; 

const cards = [
  { name: "6", value: 6 },
  { name: "7", value: 7 },
  { name: "8", value: 8 },
  { name: "9", value: 9 },
  { name: "10", value: 10 },
  { name: "2", value: 2 },
  { name: "3", value: 3 },
  { name: "4", value: 4 },
  { name: "11", value: 11 }
];

const koloda = [];
cards.forEach(card => {
  mast.forEach(m => {
    koloda.push({
      name: card.name,
      value: card.value,
      mast: m,
      img: `${card.name}_${m}.jpeg`
    });
  });
});

function catCard() {
  const randomD = Math.floor(Math.random() * koloda.length);
  const card = koloda[randomD];
  koloda.splice(randomD, 1);
  return card;
}

generate.addEventListener('click', () => {
  if (round < 3) {
    round++;
    const userCard = catCard();
    const computerCard = catCard();

    userNumber.innerHTML = `<img src="${userCard.img}" alt="user card" style="width:180px;">`;
    computerNumber.innerHTML = `<img src="${computerCard.img}" alt="computer card" style="width:180px;">`;

    userScore += userCard.value;
    computerScore += computerCard.value;

    user.textContent = userScore;
    computer.textContent = computerScore;

    if (round === 3) {
      end();
    }
  } else {
    alert("Game over! Refresh the page for a new game.");
  }
});

function end() {
  let result = "";
  if (userScore > 21 && computerScore > 21) {
    result = "Both players exceeded 21 — Draw!";
  }
  else if (userScore > 21) {
    result = "The computer won!";
  }
  else if (computerScore > 21) {
    result = `${userName} won! 🎉`;
  }
  else {
    const sumUs = 21 - userScore;
    const sumCom = 21 - computerScore;

    if (sumUs < sumCom) {
      result = `${userName} won! 🎉`;
    } else if (sumCom < sumUs) {
      result = "The computer won!";
    } else {
      result = "Draw!";
    }
  }

  setTimeout(() => alert(result), 300);
}
