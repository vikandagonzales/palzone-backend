const locationModel = require('../models/locations')


function getOneLocation(req, res, next) {
  if (!req.params.location_id) {
    return next({status: 400, message: 'No user id'})
  }
    locationModel.getOneLocation(req.params.location_id)
  .then(data => {
    res.status(200).send({data})
  })
  .catch(next)
}

function getAllLocations(req, res, next) {
    const {lat, lng} = req.query;

    locationModel.getAllLocations(lat, lng)
  .then(data => {
    res.status(200).send({data})
  })
  .catch(next)
}

module.exports = {
  getAllLocations,
  getOneLocation
}
