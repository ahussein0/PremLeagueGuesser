import { useState, useEffect } from 'react';
import { fetchPlayers } from '../services/api';

interface GuessInputProps {
  onGuess: (playerName: string) => void;
  disabled?: boolean;
}

export function GuessInput({ onGuess, disabled }: GuessInputProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (disabled || input.length < 3) {
      setSuggestions([]);
      return;
    }

    const searchPlayers = async () => {
      try {
        const data = await fetchPlayers(input);
        if (data.response) {
          setSuggestions(data.response.map(item => item.player.name));
        }
      } catch (error) {
        console.error('Error searching players:', error);
      }
    };

    const timeoutId = setTimeout(searchPlayers, 300);
    return () => clearTimeout(timeoutId);
  }, [input, disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled && input.trim()) {
      onGuess(input);
      setInput('');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!disabled) {
      onGuess(suggestion);
      setInput('');
      setSuggestions([]);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Guess a player..."
          className="w-full p-2 border rounded"
          disabled={disabled}
        />
      </form>
      
      {!disabled && suggestions.length > 0 && (
        <ul className="absolute w-full bg-white border rounded-b mt-1 max-h-60 overflow-auto z-10">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}