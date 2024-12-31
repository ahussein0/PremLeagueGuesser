import { useState, useEffect } from 'react';
import { players } from '../data/players';
import type { Player, Guess } from '../types';

export function useGameState() {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  // Initialize daily player
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const index = hashDate(today) % players.length;
    setCurrentPlayer(players[index]);
  }, []);

  const checkGuess = (playerName: string): Guess | null => {
    if (!currentPlayer) return null;

    const guessedPlayer = players.find(
      p => p.name.toLowerCase() === playerName.toLowerCase()
    );

    if (!guessedPlayer) return null;

    return {
      player: guessedPlayer,
      isCorrect: guessedPlayer.id === currentPlayer.id,
      matches: {
        conference: guessedPlayer.conference === currentPlayer.conference,
        division: guessedPlayer.division === currentPlayer.division,
        position: guessedPlayer.position === currentPlayer.position,
        height: compareValues(
          heightToInches(guessedPlayer.height),
          heightToInches(currentPlayer.height)
        ),
        age: compareValues(guessedPlayer.age, currentPlayer.age),
        number: compareValues(guessedPlayer.number, currentPlayer.number)
      }
    };
  };

  const makeGuess = (playerName: string) => {
    const guess = checkGuess(playerName);
    if (guess) {
      setGuesses(prev => [...prev, guess]);
      if (guess.isCorrect || guesses.length + 1 >= 15) {
        setIsComplete(true);
      }
    }
  };

  return {
    currentPlayer,
    guesses,
    isComplete,
    makeGuess
  };
}