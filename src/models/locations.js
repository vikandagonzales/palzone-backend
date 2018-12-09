const knex = require("../../db");

function getOneLocation(location_id) {
  // return (knex('users').where({id: user_id}).first())
}

function getAllLocations(lat, lng) {
  // return (knex('users')
  // .where({email: email})
  // .first())
  return Promise.resolve("HELLO");
}

module.exports = {
  getOneLocation,
  getAllLocations
};
