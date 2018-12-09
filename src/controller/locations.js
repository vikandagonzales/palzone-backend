const locationModel = require("../models/locations");

function getOneLocation(req, res, next) {
  const { name, address1, city, point, zip_code } = req.body;
  locationModel
    .getOneLocation(name, address1, city, point, zip_code)
    .then(data => {
      res.status(200).send({ data });
    })
    .catch(next);
}

function getAllLocations(req, res, next) {
  const { lat, lng } = req.query;

  locationModel
    .getAllLocations(lat, lng)
    .then(data => {
      res.status(200).send({ data });
    })
    .catch(next);
}

module.exports = {
  getAllLocations,
  getOneLocation
};
