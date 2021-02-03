INSERT INTO users (name, email, password)
VALUES ('Eric', 'eric@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Lolo', 'lolo@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Amigo', 'amigo@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'Big House', 'description', 'imghost.ca/thumb.png', 'imghost.ca/cover.png', 10000, 1, 2, 2, 'Canada', 'West 12th', 'Vancouver', 'BC', '12345', TRUE),
(2, 'Medium House', 'description', 'imghost.ca/thumb.png', 'imghost.ca/cover.png', 10000, 1, 2, 2, 'Canada', 'West 12th', 'Vancouver', 'BC', '12345', TRUE),
(3, 'Small House', 'description', 'imghost.ca/thumb.png', 'imghost.ca/cover.png', 10000, 1, 2, 2, 'Canada', 'West 12th', 'Vancouver', 'BC', '12345', TRUE);

INSERT INTO reservations (guest_id, property_id, start_date, end_date) 
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 1, 3, 'message'),
(2, 2, 2, 4, 'message'),
(3, 3, 3, 5, 'message');