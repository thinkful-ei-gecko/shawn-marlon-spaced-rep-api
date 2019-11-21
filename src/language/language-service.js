const LinkedList = require('../LinkedList/LinkedList');

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
      .orderBy('next', 'ascending')
  },

  populateLinkedList(language, words) {
    const ll = new LinkedList();
    ll.id = language.id;
    ll.name = language.name;
    ll.total_score = language.total_score;
    let word = words.find(w => w.id === language.head)  //created by getLanguageWords
    ll.insertFirst({
      id: word.id,
      original: word.original,
      translation: word.translation,
      memory_value: word.memory_value,
      correct_count: word.correct_count,
      incorrect_count: word.incorrect_count,
    })
    while (word.next) {
      word = words.find(w => w.id === word.next)
      ll.insertLast({
        id: word.id,
        original: word.original,
        translation: word.translation,
        memory_value: word.memory_value,
        correct_count: word.correct_count,
        incorrect_count: word.incorrect_count,
      })
    }
    return ll
  },


  getTotalScore(db, user_id) {
    return db
      .from('language')
      .select(
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },


  // getLanguageWords(db, language_id) {
  //   return db
  //     .from('word')
  //     .select(
  //       'id',
  //       'language_id',
  //       'original',
  //       'translation',
  //       'next',
  //       'memory_value',
  //       'correct_count',
  //       'incorrect_count',
  //     )
  //     .where({ language_id })
  //     .orderBy('next', 'ascending')
  // },

  getOnDeck(db, head) {
    return db
      .from('word')
      .select('translation', 'original', 'correct_count', 'incorrect_count')
      .where('word.id', head)
      .then(word => {
        return {
          translation: word[0].translation,
          nextWord: word[0].original,
          wordCorrectCount: word[0].correct_count,
          wordIncorrectCount: word[0].incorrect_count
        };
      });
  },

///////////////////////////////////////////////////////////////////////////////////////////////////////


persistLinkedList(db, linkedLanguage) {
  return db.transaction(trx =>
    Promise.all([
      db('language')
        .transacting(trx)
        .where('id', linkedLanguage.id)
        .update({
          total_score: linkedLanguage.total_score,
          head: linkedLanguage.head.value.id,
        }),

      ...linkedLanguage.forEach(node =>
        db('word')
          .transacting(trx)
          .where('id', node.value.id)
          .update({
            memory_value: node.value.memory_value,
            correct_count: node.value.correct_count,
            incorrect_count: node.value.incorrect_count,
            next: node.next ? node.next.value.id : null,
          })
      )
    ])
  )
}

// persistLinkedList(db, SLL) {
//   return db.transaction(trx =>
//     Promise.all([
//       db('language')
//         .transacting(trx)
//         .where('id', SLL.head.value.language_id)
//         .update({
//           head: SLL.head.value.id,
//           // total_score: SLL.total
//         })
//         .increment(total_score, SLL.value.total_score),
        
//       // db('language')
//       //   .transacting(trx)
//       //   .where('id', SLL.head.value.language_id)
//       //   .increment(total_score, SLL.value.total_score),

//       ...SLL.forEach(node =>
//         db('word')
//           .transacting(trx)
//           .where('id', node.value.id)
//           .update({
//             memory_value: node.value.memory_value,
//             correct_count: node.value.correct_count,
//             incorrect_count: node.value.incorrect_count,
//             next: node.next ? node.next.value.id : null,
//           })
//       )
//     ])
//   )
// }
}

//////////////////////////////////////////////////////////////////////////////////////////////

module.exports = LanguageService

