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
  mast.forEach(mast => {
    koloda.push({
      name: card.name,
      value: card.value,
      mast: mast,
      img: `${card.name}_${mast}.jpeg`
    });
  });
});

function catCard() {
  const randomD = Math.floor(Math.random() * koloda.length);
  const card = koloda[randomD];
  return card;
}

generate.addEventListener('click', () => {
  if (round < 3) {
    round++;
    const userCard = catCard();
    const computerCard = catCard();

    userNumber.innerHTML = `<img src="${userCard.img}" alt="${1}" style="width:180px;">`;
    computerNumber.innerHTML = `<img src="${computerCard.img}" alt="${2}" style="width:180px;">`;

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

  if (userScore > computerScore) {
    result = `${userName} won! 🎉`;
  } else if (computerScore > userScore) {
    result = "The computer won!";
  } else {
    result = "Draw!";
  }

  setTimeout(() => alert(result), 300);
}