//GraphiQL API
const fetch = require('node-fetch');

async function getRecommendedAnimes(req, res) {
  const query = `
    query {
      Page(page: 1, perPage: 10) {
        media(sort: TRENDING_DESC, type: MANGA) {
          id
          title {
            romaji
            english
            native
          }
          description
          coverImage {
            large
          }
          genres
          averageScore
        }
      }
    }
  `;

  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
      }),
    });

    const data = await response.json();
    res.json(data.data.Page.media);
  } catch (error) {
    console.error('Error fetching recommended animes:', error);
    res.status(500).send('Error fetching recommended animes');
  }
}

module.exports.getRecommendedAnimes = getRecommendedAnimes;
