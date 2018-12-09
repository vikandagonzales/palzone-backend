exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(() => {
      return knex('users').insert(
        [
          {id:1, first_name: 'Vikanda', last_name: 'Gonzales', email: 'vika@email', password:'$2a$10$vj6rshiShRql5E0A5DxKWOW6Qso/8C/U4ycefHIp5I5Ua3GW1HESS', photo: 'https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2017/11/12222717/Yorkshire-Terrier-Care.jpg', preferred_language: "en"},
          {id:2, first_name: 'Wendy', last_name: 'Parsons', email: 'wendy@email', password:'$2a$10$vj6rshiShRql5E0A5DxKWOW6Qso/8C/U4ycefHIp5I5Ua3GW1HESS', photo: 'http://pupjoyblog.com/wp-content/uploads/2018/05/Body-Language-418x315.jpg', preferred_language: "en"},
          {id:3, first_name: 'Mark', last_name: 'Pavlovski', email: 'mark@email', password:'$2a$10$vj6rshiShRql5E0A5DxKWOW6Qso/8C/U4ycefHIp5I5Ua3GW1HESS', photo: 'http://pupjoyblog.com/wp-content/uploads/2018/05/Body-Language-418x315.jpg', preferred_language: "en"},
          {id:4, first_name: 'Claudia', last_name: 'Ligidakis', email: 'claudia@email', password:'$2a$10$vj6rshiShRql5E0A5DxKWOW6Qso/8C/U4ycefHIp5I5Ua3GW1HESS', photo: 'http://pupjoyblog.com/wp-content/uploads/2018/05/Body-Language-418x315.jpg', preferred_language: "en"},
        ]
      );
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"
      );
    });
};
