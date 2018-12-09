const db = require('../../db')
// const bcrypt = require('bcryptjs')
const userModel = require('./users')

function login(email, password){
  let user
  // return userModel.getUserByEmail(email)
  // .then(function(data){
  //   if(!data) throw { status: 400, message: "Bad Request"}
  //   user = data
  //   return bcrypt.compare(password, data.password)
  // })
  // .catch(bcrypt.MISMATCH_ERROR, function(){
  //   throw { status: 401, message: "Unauthorized"}
  // })
  // .then(function(){
  //   delete user.password
  //   return user
  // })
  return user
}

module.exports = {
  login
};
