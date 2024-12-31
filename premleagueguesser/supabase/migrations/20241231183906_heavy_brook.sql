/*
  # Create players table and security policies

  1. New Tables
    - `players`
      - `id` (text, primary key)
      - `name` (text)
      - `team` (text)
      - `league` (text)
      - `position` (text)
      - `height` (text)
      - `age` (integer)
      - `number` (integer)
      - `nationality` (text)
      - `silhouette` (text)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `players` table
    - Add policies for:
      - Public read access to all players
      - Only authenticated users can modify player data
*/

CREATE TABLE players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  team text NOT NULL,
  league text NOT NULL,
  position text NOT NULL,
  height text NOT NULL,
  age integer NOT NULL,
  number integer,
  created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access"
  ON players
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to modify"
  ON players
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON players
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Clear existing data
TRUNCATE TABLE players;

-- Add Liverpool players data with specific positions
INSERT INTO players (name, team, league, position, height, age, number) VALUES
('Mohamed Salah', 'Liverpool', 'Premier League', 'Right Winger', '175cm', 31, 11),
('Virgil van Dijk', 'Liverpool', 'Premier League', 'Center Back', '193cm', 32, 4),
('Alisson', 'Liverpool', 'Premier League', 'Goalkeeper', '191cm', 31, 1),
('Trent Alexander-Arnold', 'Liverpool', 'Premier League', 'Right Back', '175cm', 25, 66),
('Darwin Núñez', 'Liverpool', 'Premier League', 'Striker', '187cm', 24, 9),
('Luis Díaz', 'Liverpool', 'Premier League', 'Left Winger', '178cm', 26, 7),
('Dominik Szoboszlai', 'Liverpool', 'Premier League', 'Central Midfielder', '186cm', 23, 8),
('Cody Gakpo', 'Liverpool', 'Premier League', 'Forward', '189cm', 24, 18),
('Andrew Robertson', 'Liverpool', 'Premier League', 'Left Back', '178cm', 29, 26),
('Diogo Jota', 'Liverpool', 'Premier League', 'Forward', '178cm', 27, 20),
('Curtis Jones', 'Liverpool', 'Premier League', 'Central Midfielder', '185cm', 22, 17),
('Ibrahima Konaté', 'Liverpool', 'Premier League', 'Center Back', '194cm', 24, 5),
('Joe Gomez', 'Liverpool', 'Premier League', 'Center Back', '188cm', 26, 2),
('Harvey Elliott', 'Liverpool', 'Premier League', 'Attacking Midfielder', '170cm', 20, 19),
('Wataru Endo', 'Liverpool', 'Premier League', 'Defensive Midfielder', '178cm', 30, 3),
('Ryan Gravenberch', 'Liverpool', 'Premier League', 'Central Midfielder', '190cm', 21, 38),
('Alexis Mac Allister', 'Liverpool', 'Premier League', 'Central Midfielder', '174cm', 25, 10),
('Caoimhin Kelleher', 'Liverpool', 'Premier League', 'Goalkeeper', '188cm', 25, 62),
('Kostas Tsimikas', 'Liverpool', 'Premier League', 'Left Back', '178cm', 27, 21),
('Joel Matip', 'Liverpool', 'Premier League', 'Center Back', '195cm', 32, 32);