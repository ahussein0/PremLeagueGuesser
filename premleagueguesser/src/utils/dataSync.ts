import { fetchPlayers, fetchTeams } from '../services/api';
import { updatePlayerData } from '../services/supabase';
import type { Player } from '../types';
import { LEAGUES } from '../data/leagues';

const mapApiPlayerToPlayer = (apiPlayer: any): Player => ({
  id: apiPlayer.id.toString(),
  name: apiPlayer.name,
  team: apiPlayer.statistics[0].team.name,
  league: apiPlayer.statistics[0].league.name,
  position: apiPlayer.statistics[0].games.position,
  height: apiPlayer.height,
  age: apiPlayer.age,
  number: apiPlayer.statistics[0].games.number || 0,
  nationality: apiPlayer.nationality,
  silhouette: apiPlayer.photo
});

export const syncPlayerData = async () => {
  const leagueIds = {
    [LEAGUES.PREMIER_LEAGUE.name]: 39,
    [LEAGUES.LA_LIGA.name]: 140,
    [LEAGUES.BUNDESLIGA.name]: 78,
    [LEAGUES.SERIE_A.name]: 135,
    [LEAGUES.LIGUE_1.name]: 61
  };

  const allPlayers: Player[] = [];

  for (const [leagueName, leagueId] of Object.entries(leagueIds)) {
    const players = await fetchPlayers(leagueId.toString());
    const mappedPlayers = players.response.map(mapApiPlayerToPlayer);
    allPlayers.push(...mappedPlayers);
  }

  await updatePlayerData(allPlayers);
};