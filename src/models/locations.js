const knex = require("../../db");
const axios = require("axios");

function getOneLocation(location_id) {
  // return (knex('users').where({id: user_id}).first())
}

function getAllLocations(lat, lng) {
  axios
    .post(
      "https://apis.discover.com/auth/oauth/v2/token?grant_type=client_credentials&scope=CITYGUIDES",
      {},
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic bDd4eGFjYjE5NGY3MDUxMjQxNmE4OGZlYjdiZDAxMmE2NTg0OjM2MDliZDhmZDA5NzQyN2NhNWRlNmFkYmYyNDFmNzA0"
        }
      }
    )
    .then(async function({ data }) {
      const { access_token } = data;
      console.log(access_token);
      const cities = await axios.get(
        "https://api.discover.com/cityguides/v2/merchants?merchant_city=Los Angeles&merchant_category=restaurants",
        {
          headers: {
            "x-dfs-api-plan": "CITYGUIDES_SANDBOX",
            Authorization: `Bearer ${access_token}`
          }
        }
      );
      console.log(cities.data.result);
    })
    .catch(function(error) {
      console.log(error);
    });
  return Promise.resolve("HELLO");
}

module.exports = {
  getOneLocation,
  getAllLocations
};
