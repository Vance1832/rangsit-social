INSERT INTO users (email, password, first_name, last_name, username, birthday, bio, avatar, profile_completed, created_at) VALUES
('nina@rangsit.ac.th', '$2a$10$U3AJtSZZT1YxK2mE7bg2pOoEJ3N3r4LPG6F0bU1Qw9qcd9rO3Gc5a', 'Nina', 'Petch', 'nina.p', '2003-06-12', 'Design student who loves UI and coffee.', 'https://i.pravatar.cc/150?img=32', 1, NOW() - INTERVAL 10 DAY),
('krit@rangsit.ac.th', '$2a$10$U3AJtSZZT1YxK2mE7bg2pOoEJ3N3r4LPG6F0bU1Qw9qcd9rO3Gc5a', 'Krit', 'Tan', 'krit.t', '2002-11-03', 'Computer engineering, hackathon addict.', 'https://i.pravatar.cc/150?img=13', 1, NOW() - INTERVAL 9 DAY),
('mali@rangsit.ac.th', '$2a$10$U3AJtSZZT1YxK2mE7bg2pOoEJ3N3r4LPG6F0bU1Qw9qcd9rO3Gc5a', 'Mali', 'Sorn', 'mali.s', '2003-02-21', 'Business major. Marketing and memes.', 'https://i.pravatar.cc/150?img=47', 1, NOW() - INTERVAL 8 DAY),
('jame@rangsit.ac.th', '$2a$10$U3AJtSZZT1YxK2mE7bg2pOoEJ3N3r4LPG6F0bU1Qw9qcd9rO3Gc5a', 'Jame', 'Pree', 'jame.p', '2001-09-18', 'Photographer for campus events.', 'https://i.pravatar.cc/150?img=52', 1, NOW() - INTERVAL 7 DAY);

INSERT INTO posts (user_id, content, media_url, media_type, created_at, updated_at) VALUES
(1, 'First week of finals. Remember to hydrate and take breaks. You got this!', NULL, NULL, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY),
(2, 'Built a quick study tracker for our class group. DM me if you want access.', NULL, NULL, NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY),
(3, 'Marketing club meetup tonight at 7pm. Free snacks!', 'https://images.unsplash.com/photo-1528605248644-14dd04022da1', 'image', NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY),
(4, 'Captured sunset over campus library. So calm!', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee', 'image', NOW() - INTERVAL 5 HOUR, NOW() - INTERVAL 5 HOUR);

INSERT INTO comments (post_id, user_id, content, created_at) VALUES
(1, 2, 'Needed this reminder today. Thanks!', NOW() - INTERVAL 2 DAY),
(1, 3, 'Hydration squad reporting in!', NOW() - INTERVAL 2 DAY),
(3, 1, 'I will be there with the design team.', NOW() - INTERVAL 20 HOUR),
(4, 2, 'That shot is beautiful. Nice work!', NOW() - INTERVAL 4 HOUR);

INSERT INTO likes (post_id, user_id, created_at) VALUES
(1, 2, NOW() - INTERVAL 2 DAY),
(1, 3, NOW() - INTERVAL 2 DAY),
(2, 1, NOW() - INTERVAL 1 DAY),
(3, 4, NOW() - INTERVAL 10 HOUR),
(4, 1, NOW() - INTERVAL 3 HOUR);

INSERT INTO saved_posts (user_id, post_id, created_at) VALUES
(1, 3, NOW() - INTERVAL 12 HOUR),
(2, 1, NOW() - INTERVAL 1 DAY),
(3, 4, NOW() - INTERVAL 3 HOUR);

INSERT INTO follows (follower_id, following_id, created_at) VALUES
(2, 1, NOW() - INTERVAL 5 DAY),
(3, 1, NOW() - INTERVAL 4 DAY),
(1, 4, NOW() - INTERVAL 2 DAY),
(4, 2, NOW() - INTERVAL 1 DAY);
