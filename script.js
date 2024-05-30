let countries = [];
let currentQuestionIndex = 0;
let score = 0;
let highestScore = 0;
let timer;
let timerWidth = 100;

async function fetchCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        countries = data.map(country => ({
            name: country.name.common,
            flag: country.flags.png
        }));
        loadQuestion();
        document.getElementById('play-again-btn').style.display = 'none'; // Hide Play Again button initially
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function loadQuestion() {
    const randomCountries = shuffle(countries).slice(0, 3);
    const correctCountry = randomCountries[Math.floor(Math.random() * 3)];

    document.getElementById('flag').src = correctCountry.flag;
    document.getElementById('flag').alt = correctCountry.name;

    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = '';
    randomCountries.forEach(choice => {
        const choiceElement = document.createElement('div');
        choiceElement.classList.add('choice');
        choiceElement.innerHTML = `<input type="radio" name="choice" value="${choice.name}" id="${choice.name.replace(/\s+/g, '-')}-choice"><label for="${choice.name.replace(/\s+/g, '-')}-choice">${choice.name}</label>`;
        choiceElement.addEventListener('click', submitAnswer); // Directly trigger answer submission on click
        choicesContainer.appendChild(choiceElement);
    });

    document.getElementById('result').innerText = '';
    resetTimer();
}

function resetTimer() {
    timerWidth = 100;
    const timerBar = document.getElementById('timer-bar');
    timerBar.innerHTML = '<div></div>';
    timerBar.firstChild.style.width = `${timerWidth}%`;
    clearInterval(timer);
    timer = setInterval(decreaseTimer, 50);
}

function decreaseTimer() {
    timerWidth -= 1;
    document.getElementById('timer-bar').firstChild.style.width = `${timerWidth}%`;
    if (timerWidth <= 0) {
        clearInterval(timer);
        gameOver();
    }
}

function submitAnswer(event) {
    const selectedChoice = event.currentTarget.querySelector('input');
    const answer = selectedChoice.value;
    const correctAnswer = document.getElementById('flag').alt;

    const choices = document.querySelectorAll('.choice');
    choices.forEach(choice => {
        choice.classList.remove('selected', 'incorrect', 'correct'); // Remove all previous classes
        if (choice.querySelector('input').value === correctAnswer) {
            choice.classList.add('selected'); // Add the "correct" class to the correct answer
        } else if (choice.querySelector('input').value === answer) {
            choice.classList.add('incorrect'); // Add the "selected" class to the selected answer
        } else {
            choice.classList.add('incorrect'); // Add the "incorrect" class to wrong answers
        }
    });

    clearInterval(timer);

    if (answer === correctAnswer) {
        score++;
        document.getElementById('score').innerText = `Score: ${score}`;
        if (score > highestScore) {
            highestScore = score;
            document.getElementById('highest-score').innerText = `Highest Score: ${highestScore}`;
        }
        setTimeout(() => {
            choices.forEach(choice => {
                choice.classList.remove('selected', 'incorrect');
                choice.classList.add('correct');
            });
            loadQuestion();
        }, 1000); // Wait for 1 second before loading the next question
    } else {
        setTimeout(() => {
            gameOver();
        }, 1000); // Wait for 1 second before ending the game
    }
}


function gameOver() {
    document.getElementById('quiz-container').innerHTML = `<h2>Game Over! Your score is ${score}</h2>`;
    document.getElementById('play-again-btn').style.display = 'block';
    clearInterval(timer);
}

function playAgain() {
    // Retrieve the current high score from local storage

    window.location.href = 'index.html';
    

}


function startQuiz() {
    // Show the quiz container and score container
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('score-container').style.display = 'block';
    // Hide the Start Quiz button
    document.getElementById('start-quiz-btn').style.display = 'none';
    // Call a function to start the timer or load the first question
    // For example, you can call a function like loadQuestion() here
    // loadQuestion();
}

document.addEventListener('DOMContentLoaded', fetchCountries);
