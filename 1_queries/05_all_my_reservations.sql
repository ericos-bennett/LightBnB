SELECT reservations.*, properties.*, AVG(rating) AS average_rating
FROM users
JOIN reservations ON users.id = guest_id
JOIN properties ON property_id = properties.id
JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE users.id = 1 AND end_date < now()::date
GROUP BY reservations.id, properties.id
ORDER BY start_date
LIMIT 10;