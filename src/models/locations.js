const knex = require("../../db");
const axios = require("axios");

const getDistance = (a, b) => {
  if (!(a && b)) return 0;
  if (!(a.lat && a.long && b.lat && b.long)) return 0;
  const R = 6371000; // metres
  const φ1 = a.lat * (Math.PI / 180);
  const φ2 = b.lat * (Math.PI / 180);
  const Δφ = φ2 - φ1;
  const Δλ = (b.long - a.long) * (Math.PI / 180);
  const α =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(α), Math.sqrt(1 - α));
  const d = R * c;
  return d;
};

function getOneLocation(location_id) {
  // return (knex('users').where({id: user_id}).first())
}

async function getAllLocations(lat, long) {
  console.log("!", lat, long);
  const { data } = await axios.post(
    "https://apis.discover.com/auth/oauth/v2/token?grant_type=client_credentials&scope=CITYGUIDES",
    {},
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic bDd4eGFjYjE5NGY3MDUxMjQxNmE4OGZlYjdiZDAxMmE2NTg0OjM2MDliZDhmZDA5NzQyN2NhNWRlNmFkYmYyNDFmNzA0"
      }
    }
  );
  const cityNames = await axios.get(
    "https://api.discover.com/cityguides/v2/cities",
    {
      headers: {
        "x-dfs-api-plan": "CITYGUIDES_SANDBOX",
        Authorization: `Bearer ${data.access_token}`
      }
    }
  );
  const cityNameObjects = cityNames.data.result;
  const sortedCities = cityNameObjects
    .map(el => ({
      ...el["_id"],
      distance: getDistance(el["_id"], {
        lat: parseFloat(lat),
        long: parseFloat(long)
      })
    }))
    .sort(
      (a, b) =>
        getDistance(a, {
          lat: parseFloat(lat),
          long: parseFloat(long)
        }) -
        getDistance(b, {
          lat: parseFloat(lat),
          long: parseFloat(long)
        })
    );
  const closestCity = sortedCities[0].city;

  const cityResults = await axios.get(
    `https://api.discover.com/cityguides/v2/merchants?merchant_city=${closestCity}&merchant_category=restaurants`,
    {
      headers: {
        "x-dfs-api-plan": "CITYGUIDES_SANDBOX",
        Authorization: `Bearer ${data.access_token}`
      }
    }
  );
  const cities = cityResults.data.result;
  return cities.map(el => {
    const { name, address1, city, point } = el;
    return { name, address1, city, point };
  });
}

module.exports = {
  getOneLocation,
  getAllLocations
};
