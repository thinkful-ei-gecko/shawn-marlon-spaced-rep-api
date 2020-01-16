BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Test User',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Morse', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (2, 1, '-...', 'B', 1),
  (4, 1, '-..', 'D', 2),
  (1, 1, '.-', 'A', 3),
  (36, 1, '-----', '0', 4),
  (5, 1, '.', 'E', 5),
  (6, 1, '..-.', 'F', 6),
  (31, 1, '.....', '5', 7),
  (27, 1, '.----', '1', 8),
  (32, 1, '-....', '6', 9),
  (30, 1, '....-', '4', 10),
  (7, 1, '--.', 'G', 11),
  (3, 1, '-.-.', 'C', 12),
  (34, 1, '---..', '8', 13),
  (11, 1, '-.-', 'K', 14),
  (9, 1, '..', 'I', 15),  
  (10, 1, '.---', 'J', 16),
  (12, 1, '.-..', 'L', 17),
  (13, 1, '--', 'M', 18),
  (14, 1, '-.', 'N', 19),
  (8, 1, '....', 'H', 20),
  (26, 1, '--..', 'Z', 21),
  (16, 1, '.--.', 'P', 22),
  (18, 1, '.-.', 'R', 23),
  (17, 1, '--.-', 'Q', 24),
  (24, 1, '-..-', 'X', 25),
  (19, 1, '...', 'S', 26),
  (20, 1, '-', 'T', 27),
  (21, 1, '..-.', 'U', 28),
  (33, 1, '--...', '7', 29),
  (22, 1, '...-', 'V', 30),
  (23, 1, '.--', 'W', 31),
  (15, 1, '---', 'O', 32),	
  (28, 1, '..---', '2', 33),
  (25, 1, '-.--', 'Y', 34),
  (29, 1, '...--', '3', 35),
  (35, 1, '----.', '9', null);

UPDATE "language" SET head = 1 WHERE id = 1;

SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;