
const getAllGamesApi = 'https://storage.googleapis.com/estoty-temp/games.json';
const getAllRetentionApi = 'https://storage.googleapis.com/estoty-temp/retention.json';

export async function load({ fetch }) {
  const urls = [getAllGamesApi, getAllRetentionApi];

  const requests = urls.map((url) => fetch(url)); 
  const responses = await Promise.all(requests); 
  const promises = responses.map((response) => response.json());
  const results =  await Promise.all(promises);

  return {
    games: results[0],
    retention: results[1],
  }
}