import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GuessInput } from './components/GuessInput';
import { GuessTable } from './components/GuessTable';
import type { Guess } from './types';
import axios from 'axios';
import './styles/pixel-font.css';

const api = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-apisports-key': 'd2662c0dc5b5882a1a3a429e6d78fd96'
  }
});

function App() {
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [targetPlayer, setTargetPlayer] = useState<any>(null);
  const [silhouetteUrl, setSilhouetteUrl] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    getRandomPlayer();
  }, []);

  const getRandomPlayer = async () => {
    try {
      const randomPage = Math.floor(Math.random() * 5) + 1;
      const response = await api.get('/players', {
        params: {
          league: '39',
          season: '2024',
          page: randomPage
        }
      });

      if (response.data.response?.length > 0) {
        const randomIndex = Math.floor(Math.random() * response.data.response.length);
        const player = response.data.response[randomIndex];
        
        // Get detailed player info
        const playerDetails = await api.get('/players', {
          params: {
            id: player.player.id,
            season: '2024'
          }
        });

        const detailedPlayer = playerDetails.data.response[0];
        setTargetPlayer(detailedPlayer);
        setSilhouetteUrl(`https://media.api-sports.io/football/players/${player.player.id}.png`);
      }
    } catch (error) {
      console.error('Error getting random player:', error);
    }
  };

  const resetGame = async () => {
    // Clear all states
    setGuesses([]);
    setIsCorrect(false);
    setGaveUp(false);
    setTargetPlayer(null);
    setSilhouetteUrl('');
    
    // Get new random player
    await getRandomPlayer();
  };

  // Update handleGuess to compare with target player
  const handleGuess = async (playerName: string) => {
    try {
      console.log('Searching for player:', playerName);
      
      // First try with the original name
      let response = await api.get('/players', {
        params: {
          search: playerName,
          league: '39',
          season: '2024'
        }
      });

      // If no results and has period or hyphen, try simplified name
      if (!response.data.response?.length && (playerName.includes('.') || playerName.includes('-'))) {
        const simplifiedName = playerName
          .replace('.', ' ')
          .replace('-', ' ')
          .split(' ')
          .filter(part => part.length > 0)
          .slice(1) // Remove initial if present
          .join(' ');
        
        console.log('Trying simplified name:', simplifiedName);
        
        response = await api.get('/players', {
          params: {
            search: simplifiedName,
            league: '39',
            season: '2024'
          }
        });
      }

      console.log('Search response:', response.data);

      if (response.data.response?.[0] && targetPlayer) {
        const playerData = response.data.response[0];
        const player = playerData.player;

        // Get additional player details with team
        const playerDetailsResponse = await api.get('/players', {
          params: {
            id: player.id,
            season: '2024'
          }
        });

        console.log('Player details response:', playerDetailsResponse.data);

        const playerDetails = playerDetailsResponse.data.response[0];
        const statistics = playerDetails?.statistics?.find((stat: any) => stat.league.id === 39) || playerDetails?.statistics[0];
        const targetStats = targetPlayer.statistics.find((stat: any) => stat.league.id === 39) || targetPlayer.statistics[0];

        console.log('Found player:', player.name);
        console.log('Player stats:', statistics);
        console.log('Target stats:', targetStats);

        const newGuess: Guess = {
          player: {
            id: player.id.toString(),
            name: player.name,
            team: statistics?.team?.name || 'Unknown',
            league: 'Premier League',
            position: statistics?.games?.position || player.position || 'Unknown',
            height: player.height || 'Unknown',
            age: player.age || 0,
            number: statistics?.number || playerDetails?.player?.number || 0,
            nationality: player.nationality,
            silhouette: ''
          },
          isCorrect: player.id === targetPlayer.player.id,
          matches: {
            league: true,
            team: statistics?.team?.id === targetStats?.team?.id,
            position: (statistics?.games?.position || player.position) === (targetStats?.games?.position || targetPlayer.player.position),
            height: compareHeight(player.height || '0', targetPlayer.player.height || '0'),
            age: compareAge(player.age || 0, targetPlayer.player.age || 0),
            number: compareNumber(
              statistics?.number || playerDetails?.player?.number || 0,
              targetStats?.number || targetPlayer?.player?.number || 0
            ),
            nationality: player.nationality === targetPlayer.player.nationality
          }
        };

        console.log('New guess:', newGuess);
        setGuesses(prevGuesses => [...prevGuesses, newGuess]);
        
        if (newGuess.isCorrect) {
          setIsCorrect(true);
        }
      }
    } catch (error) {
      console.error('Error fetching player details:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5e6d3]">
      <Header />
      <main className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Game Container */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - How to Play */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="space-y-3">
              <div className="border-b border-gray-200 pb-2">
                <h2 className="text-lg font-bold pixel-font">How to Play</h2>
                <p className="text-sm text-gray-600">Guess the mystery Premier League player!</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-400 rounded"></div>
                  <span>Exact match</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                  <span>Close</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-400 rounded"></div>
                  <span>No match</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>↑↓</span>
                  <span>Higher/Lower</span>
                </div>
              </div>

              <div className="text-xs grid grid-cols-2 gap-1 text-gray-600">
                <div>• Team</div>
                <div>• League</div>
                <div>• Position</div>
                <div>• Height</div>
                <div>• Age</div>
                <div>• Number</div>
              </div>
            </div>
          </div>

          {/* Center Column - Player Image and Game */}
          <div className="md:col-span-2">
            {silhouetteUrl && (
              <div className="max-w-4xl mx-auto my-4">
                <div className="flex items-center gap-8 justify-center">
                  <div className="max-w-xs relative">
                    <img 
                      src={silhouetteUrl} 
                      alt="Player Silhouette" 
                      className="w-full"
                    />
                    {!isCorrect && !gaveUp && (
                      <div 
                        className="absolute top-[25%] left-[25%] w-[50%] h-[35%] bg-black rounded-full"
                        style={{
                          boxShadow: '0 0 10px 5px black'
                        }}
                      />
                    )}
                    {isCorrect && (
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <div className="bg-green-500 text-white px-6 py-3 rounded-full text-xl font-bold shadow-lg">
                          Correct!
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-4 items-start">
                    {!isCorrect && !gaveUp && (
                      <button
                        onClick={() => setGaveUp(true)}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-lg"
                      >
                        I Give Up!
                      </button>
                    )}
                    {(isCorrect || gaveUp) && (
                      <>
                        {gaveUp && (
                          <div className="text-2xl font-bold pixel-font text-red-500 bg-red-50 px-6 py-3 rounded-lg shadow">
                            It was {targetPlayer?.player.name}!
                          </div>
                        )}
                        <button
                          onClick={resetGame}
                          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-lg"
                        >
                          Try Another Player
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Input and Guesses */}
            <div className="mt-6 space-y-4">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <GuessInput onGuess={handleGuess} disabled={isCorrect || gaveUp} />
              </div>
              <div className="bg-white rounded-xl shadow-lg p-4">
                <GuessTable guesses={guesses} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper functions for comparing values
const compareHeight = (a: string, b: string): 'lower' | 'higher' | 'correct' => {
  const heightA = parseInt(a?.replace('cm', '') || '0');
  const heightB = parseInt(b?.replace('cm', '') || '0');
  if (heightA === heightB) return 'correct';
  return heightA < heightB ? 'lower' : 'higher';
};

const compareAge = (a: number, b: number): 'lower' | 'higher' | 'correct' => {
  if (a === b) return 'correct';
  return a < b ? 'lower' : 'higher';
};

const compareNumber = (a: number, b: number): 'lower' | 'higher' | 'correct' => {
  if (a === b) return 'correct';
  return a < b ? 'lower' : 'higher';
};

export default App;