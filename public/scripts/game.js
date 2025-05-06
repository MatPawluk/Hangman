document.addEventListener('DOMContentLoaded', () => {
	const state = {
		word: '',
		guessedLetters: [],
		wrongLetters: [],
		maxWrongGuesses: 11,
		gameOver: false,
	};

	const elements = {
		wordContainer: document.getElementById('word-container'),
		missedLetters: document.getElementById('missed-letters'),
		hangmanParts: document.querySelectorAll('.hangman-part'),
		gameOverScreen: document.getElementById('game-over'),
		gameBoard: document.getElementById('game-board'),
		newWordBtn: document.getElementById('new-word-btn'),
	};

	function init() {
		fetchRandomWord();
		setupEventListeners();
	}

	async function fetchRandomWord() {
		try {
			const response = await fetch('https://random-words-api.vercel.app/word');
			const data = await response.json();
			console.log('API response:', data);

			let wordData;
			if (Array.isArray(data)) {
				wordData = data[0];
			} else if (typeof data === 'object' && data !== null) {
				wordData = data;
			} else {
				throw new Error('Invalid API response format');
			}

			if (!wordData || !wordData.word) {
				throw new Error('Missing word in API response');
			}

			state.word = wordData.word.toUpperCase().replace(/[^A-Z]/g, '');

			if (state.word.length < 3) {
				throw new Error('Word too short, fetching again');
			}

			console.log('Slowo to:', state.word);
			updateWordDisplay();
		} catch (error) {
			console.error('Error fetching word:', error);

			const fallbackWords = ['JAVASCRIPT', 'HANGMAN', 'DEVELOPER', 'PROGRAMMING', 'NETGURU']; // zaposowe jak by api nie działało
			state.word = fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
			console.log('Using fallback word:', state.word);
			updateWordDisplay();
		}
	}

	function updateWordDisplay() {
		elements.wordContainer.innerHTML = '';

		[...state.word].forEach(letter => {
			const letterBox = document.createElement('div');
			letterBox.classList.add('letter-box');

			if (state.guessedLetters.includes(letter)) {
				letterBox.textContent = letter;
				letterBox.classList.add('filled');
			}

			elements.wordContainer.appendChild(letterBox);
		});

		checkWinCondition();
	}

	function updateHangmanDisplay() {
		const wrongGuessCount = state.wrongLetters.length;

		for (let i = 0; i < wrongGuessCount; i++) {
			elements.hangmanParts[i].classList.remove('hidden');
			elements.hangmanParts[i].classList.add('show');
		}

		if (wrongGuessCount >= state.maxWrongGuesses) {
			endGame(false);
		}
	}

	function updateMissedLetters() {
		elements.missedLetters.textContent = state.wrongLetters.join(' ');
	}

	function processGuess(letter) {
		if (state.gameOver || state.guessedLetters.includes(letter) || state.wrongLetters.includes(letter)) {
			return;
		}

		if (state.word.includes(letter)) {
			state.guessedLetters.push(letter);
			updateWordDisplay();
		} else {
			state.wrongLetters.push(letter);
			updateMissedLetters();
			updateHangmanDisplay();
		}
	}

	function checkWinCondition() {
		if (state.word) {
			const uniqueLettersInWord = [...new Set(state.word.split(''))];
			const allLettersGuessed = uniqueLettersInWord.every(letter => state.guessedLetters.includes(letter));

			if (allLettersGuessed) {
				endGame(true);
			}
		}
	}

	function endGame(isWin) {
		state.gameOver = true;

		if (!isWin) {
			elements.gameOverScreen.classList.remove('hidden');
		} else {
			setTimeout(() => {
				resetGame();
			}, 1500); //nie wiem czy potrzebne ale niech będzie
		}
	}

	function resetGame() {
		state.guessedLetters = [];
		state.wrongLetters = [];
		state.gameOver = false;

		elements.hangmanParts.forEach(part => {
			part.classList.add('hidden');
			part.classList.remove('show');
		});

		elements.missedLetters.textContent = '';
		elements.gameBoard.classList.remove('hidden');
		elements.gameOverScreen.classList.add('hidden');

		fetchRandomWord();
	}

	function setupEventListeners() {
		document.addEventListener('keydown', event => {
			const letter = event.key.toUpperCase();
			if (/^[A-Z]$/.test(letter)) {
				processGuess(letter);
			}
		});

		elements.newWordBtn.addEventListener('click', resetGame);
	}

	init();
});
