// Convert date to consistent daily index
export function hashDate(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Convert height string to inches for comparison
export function heightToInches(height: string): number {
  const [feet, inches] = height.replace('"', '').split("'").map(Number);
  return (feet * 12) + (inches || 0);
}

// Compare values for height, age, and number
export function compareValues(guess: number, actual: number): 'lower' | 'higher' | 'correct' {
  if (guess === actual) return 'correct';
  return guess < actual ? 'higher' : 'lower';
}