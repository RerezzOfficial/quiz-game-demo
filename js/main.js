// Variable declarations
const mainContainer = document.querySelector(".main-container");
const gameContainer = document.querySelector(".game-container");
const startBtn = document.querySelector(".start");
const closeBtn = document.querySelector(".close");
const reloadBtn = document.querySelector(".reload");
const titleElement = document.querySelector(".title");
const questionContainer = document.querySelector(".question-container");
const answersContainer = document.querySelector(".answers");
const nextQuestionBtn = document.querySelector(".next-question");
const secondGuessBtn = document.querySelector(".second-guess-button");
const fiftyFiftyBtn = document.querySelector(".fifty-fifty");
const countDownClock = document.querySelector(".timer");
const gameStatusContainer = document.querySelector(".game-status-container");
const nextQuestionContainer = document.querySelector(".next-question-container");
const pointsContainer = document.querySelector(".points-container");
// selecting audio files
const letsPlayAudio = document.getElementById("lets-play");
const easyAudio = document.getElementById("easy");
const wrongAnswerAudio = document.getElementById("wrong-answer");
const correctAnswerAudio = document.getElementById("correct-answer");

// let gameState = false;
let gameOn = false;
let timesToGuess = 1;
let correctAnswer;
let questionList;
let listOfAnswers;
// Variables for the randomQuestionGenerator();
let data = window.questions_data;
let currentQuestion = {};
let randomGameNum = 0;
let randomQuestionNum = 0;
let questionsAsked = [];
let timeoutId;
let intervalId = null;
let points = 0;
let maxPoints = 12;
let maxLevel = 4;

// Functions
const randomNumHelperFunc = num => Math.floor(Math.random() * num);
const randomQuestionGenerator = () => {
	randomGameNum = randomNumHelperFunc(data.games.length);

	let level = Math.floor((points / maxPoints) * maxLevel) + 1;
	console.log(randomGameNum, data.games[randomGameNum], data.games[randomGameNum].questions);
	let level_questions = data.games[randomGameNum].questions.filter(x => x.level == level);
	randomQuestionNum = data.games[randomGameNum].questions.indexOf(
		level_questions[randomNumHelperFunc(level_questions.length)]
	);
	
	const questionAlreadyAsked = questionsAsked.findIndex(item => item[randomGameNum] === randomQuestionNum) === -1;
	
	if (questionAlreadyAsked) {
		currentQuestion[randomGameNum] = randomQuestionNum;
		questionsAsked.push(currentQuestion);
		currentQuestion = {};
	}
	else {
		randomQuestionGenerator();
	}
};
const fiftyFiftyGenerator = num => {
	let randomFirst;
	let randomSecond;
	// Generate first random number
	randomFirst = randomNumHelperFunc(4);
	while (randomFirst === num) {
		randomFirst = randomNumHelperFunc(4);
	}

	randomSecond = randomNumHelperFunc(4);
	while (randomSecond === randomFirst || randomSecond === num) {
		randomSecond = randomNumHelperFunc(4);
	}
	// hide two wrong answers
	document.querySelector(`[id='${randomFirst}']`).style.visibility = "hidden";
	document.querySelector(`[id='${randomSecond}']`).style.visibility = "hidden";
};
const startTimerMusic = () => {
	timer();
	// start audio
	letsPlayAudio.play();
	letsPlayAudio.volume = 0.3;
	timeoutId = setTimeout(() => {
		easyAudio.play();
		easyAudio.volume = 0.3;
	}, 4000);
};
const stopTimerMusic = () => {
	clearTimeout(timeoutId);
	clearInterval(intervalId);
	letsPlayAudio.pause();
	letsPlayAudio.currentTime = 0;
	easyAudio.pause();
	easyAudio.currentTime = 0;
	wrongAnswerAudio.pause();
	wrongAnswerAudio.currentTime = 0;
	correctAnswerAudio.pause();
	correctAnswerAudio.currentTime = 0;
};
const resetPoints = () => {
	points = 0;
	pointsContainer.textContent = `${points} / ${maxPoints}`;
	questionsAsked = [];
};
const gameOver = () => {
	lockMyAnswer = false;
	gameOn = false;
	gameContainer.classList.add("hidden");
	gameStatusContainer.classList.remove("hidden");
	if (points > 1) {
		gameStatusContainer.innerHTML = `<br>
			<span>Game Over</span><br>
			Απάντησες σωστά σε ${points} ερωτήσεις..`;
	}
	else if (points == 1) {
		gameStatusContainer.innerHTML = `<br>
			<span>Game Over</span><br>
			Απάντησες σωστά σε ${points} ερώτηση..`;
	}
	else {
		gameStatusContainer.innerHTML = `<br><span>Game Over</span>`;
	}
	startBtn.classList.remove("hidden");
	closeBtn.classList.add("hidden");
	pointsContainer.classList.add("hidden");
};
const correctAnswerFunc = () => {
	points += 1;
	gameStatusContainer.classList.remove("hidden");
	gameContainer.classList.add("hidden");
	pointsContainer.textContent = `${points} / ${maxPoints}`;

	if (points < maxPoints) {
		nextQuestionContainer.classList.remove("hidden");
		gameStatusContainer.innerHTML = `
			<i class="fa-solid fa-hands-clapping"></i> Σωστή Απάντηση<br>
			<span><i class="fa-regular fa-circle-check"></i></span>
		`;
	}
	else {

		let rank = ((points) => {
			switch(points) {
				case 0:
				case 1:
				case 2:
					return '5CR1PT_K1DD13';
				case 3:
				case 4:
					return 'N00B_H4CK3R';
				case 5:
				case 6:
					return 'PR0_H4CK3R';
				case 7:
				case 8:
					return 'ELITE_H4CK3R';
				case 9:
				case 10:
					return 'M4ST3R_H4CK3R';
				case 11:
				case 12:
					return 'D1G1T4L_L3G3ND';

			}
			return '0NL1N3_MYTH';
		})(points);

		gameStatusContainer.innerHTML = `
			<i class="fa-sharp fa-solid fa-award"></i> ΣΥΓΧΑΡΗΤΗΡΙΑ!<br>
			<span>Απέκτησες τον τίτλο <b>${rank}</b>!</span>
		`;
	}
};

const newShuffledArray = function(array) {
	array = [...array];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const nextQuestionFunc = () => {
	countDownClock.classList.remove("hidden");
	nextQuestionContainer.classList.add("hidden");
	stopTimerMusic();
	gameOn = true;
	lockMyAnswer = false;
	gameContainer.classList.remove("hidden");
	gameStatusContainer.classList.add("hidden");
	startBtn.classList.add("hidden");
	closeBtn.classList.remove("hidden");
	timesToGuess = 1;

	randomQuestionGenerator();
	startTimerMusic();

	let question = data.games[randomGameNum].questions[randomQuestionNum];

	questionList = newShuffledArray(question.content);
	correctAnswer = questionList.indexOf(question.content[question.correct]);

	answersContainer.textContent = '';
	questionContainer.textContent = '';

	
	let wrapper = document.createElement('span');
	//wrapper.textContent = question.question;
	wrapper.innerHTML = new showdown.Converter().makeHtml(question.question);
	Prism.highlightAllUnder(wrapper);
	questionContainer.appendChild(wrapper);

	let indicators = ['A', 'B', 'C', 'D'];
	questionList.forEach((item, index) => {
		let li = document.createElement('li');
		li.setAttribute('id', index);
		li.textContent = indicators[index] + '. '
		let span = document.createElement('span');
		span.textContent = item;
		li.appendChild(span);
		answersContainer.appendChild(li);
	});
};
const timer = () => {
	let currentTime = new Date().getTime();
	if (intervalId) {
		clearInterval(intervalId);
	}
	intervalId = setInterval(() => {
		let value = Math.floor((40000 + currentTime - new Date().getTime()) / 1000);
		countDownClock.innerHTML = '<i class="fa-solid fa-stopwatch"></i> ' + value;
		if (!lockMyAnswer && value <= 0) {
			gameState = false;
			clearInterval(intervalId);
			gameOver();
		}
	}, 100);
};

const correctAnswerMusic = () => {
	stopTimerMusic();
	correctAnswerAudio.volume = 0.3;
	correctAnswerAudio.play();
};
const wrongAnswerMusic = () => {
	stopTimerMusic();
	wrongAnswerAudio.volume = 0.3;
	wrongAnswerAudio.play();
};

const resize = () => {
	let scale = Math.floor(Math.min(
		(window.innerWidth - 10) / 1920 ,
		(window.innerHeight - 10) / 1200
	) * 100) / 100;

	mainContainer.style.transform = "scale(" + scale + ")";
};

// Event Listeners
window.addEventListener("load", async () => {
	//await dataLoad();
	resize();
});
window.addEventListener("resize", () => {
	resize();
});

startBtn.addEventListener("click", () => {
	stopTimerMusic();
	resetPoints();
	secondGuessBtn.classList.remove("hidden");
	fiftyFiftyBtn.classList.remove("hidden");
	nextQuestionFunc();
	pointsContainer.classList.remove("hidden");
	titleElement.classList.add("hidden");
});
closeBtn.addEventListener("click", () => {
	titleElement.classList.remove("hidden");
	resetPoints();
	stopTimerMusic();
	gameOver();
});
reloadBtn.addEventListener("click", () => {
	window.location.href = window.location.href;
});

nextQuestionBtn.addEventListener("click", () => nextQuestionFunc());
secondGuessBtn.addEventListener("click", () => {
	// change let timesToGuess to 2
	timesToGuess = 2;
	// hide the x2 button
	secondGuessBtn.classList.add("hidden");
});
fiftyFiftyBtn.addEventListener("click", () => {
	// Remove two wrong answers
	fiftyFiftyGenerator(correctAnswer);
	// hide the 50:50 button
	fiftyFiftyBtn.classList.add("hidden");
});


let lockMyAnswer = false;
answersContainer.addEventListener("click", e => {
	let target = e.target;
	while (target.tagName != 'LI' && target.parentNode) {
		target = target.parentNode;
	}
	if (!target || !target.id || target.id.length == 0) return;

	if (lockMyAnswer) return;
	lockMyAnswer = true;

	countDownClock.classList.add("hidden");
	target.classList.add("locked");
	setTimeout(() => {
		target.classList.remove("locked");

		if (target.id == correctAnswer) {
			target.classList.add("correct");
			correctAnswerMusic();
			setTimeout(() => {
				lockMyAnswer = false;
				correctAnswerFunc();
			}, 2000);
		}
		else {

			timesToGuess -= 1;
			if (timesToGuess <= 0) {
				target.classList.add("wrong");
				document.querySelector(`[id='${correctAnswer}']`).classList.add("correct");
				wrongAnswerMusic();
				setTimeout(() => {
					gameOver();
				}, 2000);
			}
			else {
				lockMyAnswer = false;
				target.classList.add("hidden");
			}
		}
	}, 2000);
});



