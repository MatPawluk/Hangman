# Hangman Game

A simple Hangman game built with Astro and vanilla JavaScript.

## Features

- Random word generation using [RabdomWordsAPI](https://github.com/mcnaveen/Random-Words-API)
- Keyboard input (both on-screen and physical keyboard)
- Visual representation of the hangman as you make wrong guesses

## Game Rules

- The game selects a random word for you to guess
- Click letters on the keyboard or use your physical keyboard to guess letters
- For each incorrect guess, a part of the hangman is drawn
- Game ends when you either guess the word correctly or the hangman is complete (after 11 wrong guesses)
- Click "NEW WORD" to start a new game

## Technologies Used

- [Astro](https://astro.build/) - Web framework
- [SCSS](https://sass-lang.com/) - CSS preprocessor
- [RandomWordsAPI](https://github.com/mcnaveen/Random-Words-API) - API for random word generation
- Vanilla JavaScript