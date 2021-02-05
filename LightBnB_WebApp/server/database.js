const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
*/
const getUserWithEmail = email => {
  const queryString = `SELECT * FROM users WHERE email = $1`;
  const values = [email];
  
  return pool.query(queryString, values)
    .then(res => res.rows.length ? res.rows[0] : null)
    .catch(err => console.log(err));
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = id => {
  const queryString = `SELECT * FROM users WHERE id = $1`;
  const values = [id];
  
  return pool.query(queryString, values)
    .then(res => res.rows.length ? res.rows[0] : null)
    .catch(err => console.log(err));
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = user => {
  const queryString = `INSERT INTO users (name, email, password) 
                       VALUES ($1, $2, $3)
                       RETURNING *`;
  const values = [user.name, user.email, user.password];
  
  return pool.query(queryString, values)
    .then(user => user.rows[0])
    .catch(err => console.log(err));
};
exports.addUser = addUser;


/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guestId The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = (guestId, limit = 10) => {
  const queryString = `
    SELECT reservations.*, properties.*, AVG(rating) AS average_rating
    FROM users
    JOIN reservations ON users.id = guest_id
    JOIN properties ON property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE users.id = $1 AND end_date < now()::date
    GROUP BY reservations.id, properties.id
    ORDER BY start_date
    LIMIT $2;`;
  const values = [guestId, limit];
  
  return pool.query(queryString, values)
    .then(user => user.rows)
    .catch(err => console.log(err));
};
exports.getAllReservations = getAllReservations;


/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  LEFT JOIN property_reviews ON properties.id = property_id
  `;

  let areSearchParams = options.city ||
  (options.minimum_price_per_night && options.maximum_price_per_night) ||
   options.owner_id;

  // If there are appropriate filters, concat a WHERE
  if (areSearchParams) queryString += `WHERE `;

  if (options.city) {
    queryParams.push(options.city);
    queryString += `city LIKE '%' || $${queryParams.length} || '%' AND `;
  }
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100,
      options.maximum_price_per_night * 100);
    queryString += `cost_per_night >= $${queryParams.length - 1} AND cost_per_night <= $${queryParams.length} AND `;
  }
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `owner_id = $${queryParams.length} AND `;
  }
  
  // If there are any appropriate filters, trim the final 'AND '
  if (areSearchParams) queryString = queryString.slice(0, -4);
  
  queryString += `
  GROUP BY properties.id
  `;
  
  // As an aggregate, minimum rating must be handled later in a HAVING clause
  if (options.minimum_rating) {
    queryParams.push(Number(options.minimum_rating));
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length}
    `;
  }
  
  queryParams.push(limit);
  queryString += `ORDER BY cost_per_night
  LIMIT $${queryParams.length};`;
  
  return pool.query(queryString, queryParams)
    .then(res => res.rows)
    .catch(err => console.log(err));
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = p => {
  const queryString = `INSERT INTO properties (title, description, number_of_bedrooms, number_of_bathrooms, parking_spaces, cost_per_night, thumbnail_photo_url, cover_photo_url, street, country, city, province, post_code, owner_id)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;`;
  const values = [p.title, p.description, Number(p.number_of_bedrooms), Number(p.number_of_bathrooms), Number(p.parking_spaces), Number(p.cost_per_night), p.thumbnail_photo_url, p.cover_photo_url, p.street, p.country, p.city, p.province, p.post_code, p.owner_id];
  
  return pool.query(queryString, values)
    .then(newProp => {
      console.log(newProp.rows[0]);
      return newProp.rows[0];
    })
    .catch(err => console.log(err));

};
exports.addProperty = addProperty;
