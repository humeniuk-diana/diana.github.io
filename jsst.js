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

function diana() {
    return Math.floor(Math.random() * 10) + 1;
}

generate.addEventListener('click', () => {
    if(userScore < 3 && computerScore < 3) {
        const userN = diana();
        const computerN = diana();
        userNumber.textContent = userN;
        computerNumber.textContent = computerN;
        if(userN > computerN) {
            userScore++;
        } else if(computerN > userN) {
            computerScore++;
        }
        user.textContent = userScore;
        computer.textContent = computerScore;

        if(userScore === 3) {
            alert(`${userName} won! 🎉`);
        } else if(computerScore === 3) {
            alert("The computer is moving! 🤖");
        }
    } else {
        alert("Game over! Refresh page for new game.");
    }
});