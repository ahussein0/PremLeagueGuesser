import axios from 'axios';

const api = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-apisports-key': 'd2662c0dc5b5882a1a3a429e6d78fd96'
  }
});

interface ApiResponse {
  response: any[];
}

export const fetchPlayers = async (search: string): Promise<ApiResponse> => {
  try {
    // Clean and normalize the search string
    const normalizeString = (str: string) => {
      return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-zA-Z0-9\s]/g, ' ') // Replace special chars with space
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .toLowerCase()
        .trim();
    };

    let cleanSearch = normalizeString(search);
    console.log('Initial search:', cleanSearch);

    // Try first search with original input
    let response = await api.get('/players', {
      params: {
        search: cleanSearch,
        league: '39',
        season: '2024'
      }
    });

    // Handle special cases like "T.Alexander-Arnold"
    if (!response.data.response?.length && search.includes('.')) {
      // Remove initial and special characters
      const nameParts = search.split('.');
      if (nameParts.length > 1) {
        const nameWithoutInitial = normalizeString(nameParts[1]);
        console.log('Trying without initial:', nameWithoutInitial);
        
        response = await api.get('/players', {
          params: {
            search: nameWithoutInitial,
            league: '39',
            season: '2024'
          }
        });

        // If still no results, try last name only
        if (!response.data.response?.length) {
          const lastName = nameWithoutInitial.split(/[\s-]+/).pop() || '';
          console.log('Trying with last name only:', lastName);
          
          response = await api.get('/players', {
            params: {
              search: lastName,
              league: '39',
              season: '2024'
            }
          });
        }
      }
    }

    return response.data;
  } catch (error: any) {
    console.error('Error fetching players:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchTeams = async (league: string): Promise<ApiResponse> => {
  try {
    const response = await api.get('/teams', {
      params: {
        league,
        season: '2024'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching teams:', error.response?.data || error.message);
    throw error;
  }
};
