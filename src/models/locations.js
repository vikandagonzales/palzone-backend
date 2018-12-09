const axios = require("axios");
const zipcodes = require('zipcodes');


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

async function getYelpBusinessId(name, address1, city, point, zip_code) {
    const zipcodeMetadata = zipcodes.lookup(zip_code);
    const {state, country} = zipcodeMetadata;
    const [lat, long] = JSON.parse(point);

    const result = await axios.get(
        `https://api.yelp.com/v3/businesses/matches?latitude=${lat}&longitude=${long}&name=${name}&address1=${address1}&city=${city}&state=${state}&country=${country}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.PALZONE_YELP_TOKEN}`
            }
        }
    );
    return result.data.businesses[0].id
}

async function getYelpData(yelpBusinessId) {
    const result = await axios.get(
        `https://api.yelp.com/v3/businesses/${yelpBusinessId}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.PALZONE_YELP_TOKEN}`
            }
        }
    );
    const {rating, review_count} = result.data
    return {rating, review_count}
}


async function getYelpReviews(yelpBusinessId) {
    const result = await axios.get(
        `https://api.yelp.com/v3/businesses/${yelpBusinessId}/reviews`,
        {
            headers: {
                Authorization: `Bearer ${process.env.PALZONE_YELP_TOKEN}`
            }
        }
    );
    return result.data.reviews
}

async function googleBusinessId(name) {
    const googleSearch = await axios.get(
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?parameters&key=${process.env.PALZONE_GOOGLE_TOKEN}&input=${name}&inputtype=textquery`,
    );
   return googleSearch.data.candidates[0].place_id
}

async function googleReviews(placeId){
    const googleReviewList = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?parameters&key=${process.env.PALZONE_GOOGLE_TOKEN}&place_id=${placeId}`
    );
    const {rating, reviews} =  googleReviewList.data.result
    return {rating, reviews}
}

async function getOneLocation(name, address1, city, point, zip_code) {
    const yelpBusinessId = await getYelpBusinessId(name, address1, city, point, zip_code);
    const yelpRating = await getYelpData(yelpBusinessId);
    const yelpReviews = await getYelpReviews(yelpBusinessId);

    const googleId = await googleBusinessId(name)
    const {rating, reviews} = await googleReviews(googleId)
    return { yelpBusinessId, yelpRating, yelpReviews, googleRating: rating, googleReviews: reviews}
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
    `https://api.discover.com/cityguides/v2/merchants?merchant_city=${closestCity}&merchant_category=hotels`,
    {
      headers: {
        "x-dfs-api-plan": "CITYGUIDES_SANDBOX",
        Authorization: `Bearer ${data.access_token}`
      }
    }
  );
  const cities = cityResults.data.result;
  return cities.map(el => {
    const { name, address1, city, point, zip_code } = el;
    return { name, address1, city, point, zip_code };
  });
}

module.exports = {
  getOneLocation,
  getAllLocations
};
