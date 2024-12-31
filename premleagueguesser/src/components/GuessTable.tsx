import type { Guess } from '../types';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface GuessTableProps {
  guesses: Guess[];
}

export function GuessTable({ guesses }: GuessTableProps) {
  return (
    <div className="max-w-4xl mx-auto mt-4">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-4 border-black">
            <th className="p-2 text-left pixel-font">Name</th>
            <th className="p-2 text-left pixel-font">Team</th>
            <th className="p-2 text-left pixel-font">League</th>
            <th className="p-2 text-left pixel-font">Position</th>
            <th className="p-2 text-left pixel-font">Height</th>
            <th className="p-2 text-left pixel-font">Age</th>
            <th className="p-2 text-left pixel-font">#</th>
          </tr>
        </thead>
        <tbody>
          {guesses.map((guess, index) => (
            <tr key={index} className="border-b-2 border-black bg-yellow-100">
              <td className="p-2 pixel-font">{guess.player.name}</td>
              <td className="p-2 pixel-font">{guess.player.team}</td>
              <td className="p-2">
                <div className={`px-2 py-1 inline-flex items-center ${
                  guess.matches.league ? 'bg-green-400' : 'bg-red-400'
                } border-2 border-black`}>
                  {guess.player.league}
                </div>
              </td>
              <td className="p-2">
                <div className={`px-2 py-1 inline-flex items-center ${
                  guess.matches.position ? 'bg-green-400' : 'bg-yellow-400'
                } border-2 border-black`}>
                  {guess.player.position}
                </div>
              </td>
              <td className="p-2">
                {guess.matches.height === 'correct' ? (
                  guess.player.height
                ) : (
                  <div className="flex items-center">
                    {guess.player.height}
                    {guess.matches.height === 'higher' ? (
                      <ArrowUp className="h-4 w-4 ml-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                )}
              </td>
              <td className="p-2">
                {guess.matches.age === 'correct' ? (
                  guess.player.age
                ) : (
                  <div className="flex items-center">
                    {guess.player.age}
                    {guess.matches.age === 'higher' ? (
                      <ArrowUp className="h-4 w-4 ml-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                )}
              </td>
              <td className="p-2">
                {guess.matches.number === 'correct' ? (
                  guess.player.number
                ) : (
                  <div className="flex items-center">
                    {guess.player.number}
                    {guess.matches.number === 'higher' ? (
                      <ArrowUp className="h-4 w-4 ml-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 ml-1" />
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}