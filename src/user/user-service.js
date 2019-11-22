const bcrypt = require("bcryptjs");

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UserService = {
  hasUserWithUserName(db, username) {
    return db("user")
      .where({ username })
      .first()
      .then(user => !!user);
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into("user")
      .returning("*")
      .then(([user]) => user);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return "Password be longer than 8 characters";
    }
    if (password.length > 72) {
      return "Password be less than 72 characters";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces";
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return "Password must contain one upper case, lower case, number and special character";
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUser(user) {
    return {
      id: user.id,
      name: user.name,
      username: user.username
    };
  },
  populateUserWords(db, user_id) {
    return db.transaction(async trx => {
      const [languageId] = await trx
        .into("language")
        .insert([{ name: "Morse", user_id }], ["id"]);

      const seq = await db
        .from("word_id_seq")
        .select("last_value")
        .first();

      const languageWords = [
        [".-", "A", 2],
        ["-...", "B", 3],
        ["-.-.", "C", 4],
        ["-..", "D", 5],
        [".", "E", 6],
        ["..-.", "F", 7],
        ["--.", "G", 8],
        ["....", "H", 9],
        ["..", "I", 10],
        [".---", "J", 11],
        ["-.-", "K", 12],
        [".-..", "L", 13],
        ["--", "M", 14],
        ["-.", "N", 15],
        ["---", "O", 16],
        [".--.", "P", 17],
        ["--.-", "Q", 18],
        [".-.", "R", 19],
        ["...", "S", 20],
        ["-", "T", 21],
        ["..-.", "U", 22],
        ["...-", "V", 23],
        [".--", "W", 24],
        ["-..-", "X", 25],
        ["-.--", "Y", 26],
        ["--..", "Z", 27],
        [".----", "1", 28],
        ["..---", "2", 29],
        ["...--", "3", 30],
        ["....-", "4", 31],
        [".....", "5", 32],
        ["-....", "6", 33],
        ["--...", "7", 34],
        ["---..", "8", 35],
        ["----.", "9", 36],
        ["-----", "0", null]
      ];

      const [languageHeadId] = await trx.into("word").insert(
        languageWords.map(([original, translation, nextInc]) => ({
          language_id: languageId.id,
          original,
          translation,
          next: nextInc ? Number(seq.last_value) + nextInc : null
        })),
        ["id"]
      );

      await trx("language")
        .where("id", languageId.id)
        .update({
          head: languageHeadId.id
        });
    });
  }
};

module.exports = UserService;