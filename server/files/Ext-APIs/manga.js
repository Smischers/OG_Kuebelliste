//GraphiQL API
const fetch = require('node-fetch');

async function getRecommendedMagas(req, res) {
  const query = `
    query {
      Page(page: 1, perPage: 10) {
        media(sort: TRENDING_DESC, type: MANGA) {
          title {
            english
          }
          description
          coverImage {
            large
          }
          genres
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
    res.status(500).send('Error fetching recommended mangas');
  }
}

module.exports.getRecommendedMagas = getRecommendedMagas;
