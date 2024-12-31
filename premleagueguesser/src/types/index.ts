export interface Player {
  id: string;
  name: string;
  team: string;
  league: string;
  position: string;
  height: string;
  age: number;
  number: number;
  nationality: string;
  silhouette: string;
}

export interface Guess {
  player: Player;
  isCorrect: boolean;
  matches: {
    league: boolean;
    team: boolean;
    position: boolean;
    height: 'lower' | 'higher' | 'correct';
    age: 'lower' | 'higher' | 'correct';
    number: 'lower' | 'higher' | 'correct';
    nationality: boolean;
  };
}