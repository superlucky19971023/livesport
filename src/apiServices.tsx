import axios from "axios";

const apiKeys = [
  "d95d96edc1msh9db8e86419372cbp1cda6bjsne22f82b1ae20",
  "6dc3e9c66emsh025915c68e25a31p17a20djsn68ab8851bc4e",
  "e7ea7840e3msh557074121030460p11ca3ajsn7cf64d3b46a6",
  "93bcc21d05msh554f2bc7573ba23p169e56jsn2d363603ced0",
  "413996c94fmsh78b49296e2a9b9ap13ced9jsn46c2b0bc625b",
  "b834de0d99mshbb50a3327d1ebd0p17d2d1jsn90d2c009fc6d",
  "71d248c088msh39137166f78b8b9p10388ejsn96d2ec662478",
  "7670f77362msh48ff0782e4cc51dp1c03bcjsn9af067c2618f",
  "d709e04130msh647f261a296d687p1a4417jsna39a8ed021a9",
  "8a46b6db00msh1209ca9e74039dfp15460djsn31c71638c321",
  "9714888d3bmsh46a577f4d9cff0ap112251jsn55f03a080707",
  "e98efbe440msha59774c3dbe0120p19b7b2jsnf925b4f52270",
  "2b5a5edcfamshbce4ec7216b7b2ep135838jsn97bd43df5f0e",
  '9068dd1c25msh36a84a3c174a99bp1e1cfejsn7ace32874bd0',
  '59784ca030mshdceceaddc0509bdp13cabajsn4aee637b8ca9',
  '08d07948b7msha7f965b4fe68e02p1492dfjsn94cfd210f569'
];

let currentKeyIndex = 0;

// Create a base configuration that we can modify
const getApiClientConfig = () => ({
  baseURL: "https://allsportsapi2.p.rapidapi.com/api",
  headers: {
    "X-RapidAPI-Key": apiKeys[currentKeyIndex],
    "X-RapidAPI-Host": "allsportsapi2.p.rapidapi.com",
  },
});

const gamesApiClient = axios.create({
  baseURL: "https://all-sport-live-stream.p.rapidapi.com/api/d",
  headers: {
    "X-RapidAPI-Key": "e7ea7840e3msh557074121030460p11ca3ajsn7cf64d3b46a6",
    "X-RapidAPI-Host": "all-sport-live-stream.p.rapidapi.com",
  },
})

// Create a new Axios instance with the current configuration
const createApiClient = () => axios.create(getApiClientConfig());
const fetchGMidFieldFromGamesApi = async (match: Match) => {
  try {
    const response = await gamesApiClient.get<{ data: { t1: MatchInfo[] } }>("/match_list?sportId=1");

    const currentMatch = response.data.data.t1.find((gameMatch: MatchInfo) => {
      const containHomeTeam = gameMatch.ename.toLowerCase().includes(match.homeTeam.toLowerCase());
      const containAwayTeam = gameMatch.ename.toLowerCase().includes(match.awayTeam.toLowerCase());

      return containHomeTeam && containAwayTeam;
    })

    if (!currentMatch) throw new Error("No matching game found");

    return currentMatch.gmid;
  } catch (error) {
    console.error("Error fetching games list:", error);
    throw error;
  }
}

export const fetchVideoStreamUrl = async (match: Match): Promise<string> => {
  const gmid = await fetchGMidFieldFromGamesApi(match)

  try {
    const response = await gamesApiClient.get(`/stream_source?gmid=${gmid}`);
    console.log(response);
    return response.data.stream_url; // Adjust this based on the actual API response structure
  } catch (error) {
    console.error("Error fetching video stream URL:", error);
    throw error;
  }
};

let apiClient = createApiClient();

const rotateApiKey = () => {
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
  console.log(`Rotating to API key index: ${currentKeyIndex}`);
  apiClient = createApiClient(); // Recreate the client with the new key
};

export const fetchData = async (endpoint: string, retryCount = 0): Promise<any> => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        
        if (status === 429 && retryCount < apiKeys.length - 1) {
          // Rotate API key and retry
          rotateApiKey();
          return fetchData(endpoint, retryCount + 1);
        }
        
        // Handle other status codes
        if (status === 503) {
          console.error("Service unavailable. The API might be down or undergoing maintenance.");
        } else if (status === 429) {
          console.error("Rate limit exceeded with all API keys. Please try again later.");
        } else {
          console.error(`API error: ${status} - ${error.response.statusText}`);
        }
        
        return {
          error: true,
          status,
          message: error.response.statusText || "An error occurred with the API"
        };
      }
    }
    
    console.error("Error fetching data:", error);
    return { error: true, message: "Failed to connect to the API" };
  }
};

// Image fetching with proper error handling
export const getImageData = async (endpoint: string, retryCount = 0): Promise<any> => {
  try {
    const response = await apiClient.get(endpoint, {
      responseType: "arraybuffer"
    });
    const base64: string = btoa(
      new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
      ))
    return base64;
  } catch (error) {

    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        
        if (status === 429 && retryCount < apiKeys.length - 1) {
          // Rotate API key and retry
          rotateApiKey();
          return fetchData(endpoint, retryCount + 1);
        }
        
        // Handle other status codes
        if (status === 503) {
          console.error("Service unavailable. The API might be down or undergoing maintenance.");
        } else if (status === 429) {
          console.error("Rate limit exceeded with all API keys. Please try again later.");
        } else {
          console.error(`API error: ${status} - ${error.response.statusText}`);
        }
        
        return {
          error: true,
          status,
          message: error.response.statusText || "An error occurred with the API"
        };
      }
    }
    
    console.error("Error fetching data:", error);
    return { error: true, message: "Failed to connect to the API" };

  }
};

// Add a health check function to test API availability
export const checkApiHealth = async () => {
  try {
    // Use a lightweight endpoint for checking
    const response = await apiClient.get('/health', { 
      timeout: 5000 // Set a reasonable timeout
    });
    return { available: true, status: response.status };
  } catch (error) {
    return { available: false, error };
  }
};