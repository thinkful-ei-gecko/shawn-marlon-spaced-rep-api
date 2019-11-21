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

  getOnDeck(db, head) {
    return db
      .from('word')
      .select('original', 'correct_count', 'incorrect_count')
      .where('word.id', head)
      .then(word => {
        return {
          nextWord: word[0].original,
          wordCorrectCount: word[0].correct_count,
          wordIncorrectCount: word[0].incorrect_count
        };
      });
  },

///////////////////////////////////////////////////////////////////////////////////////////////////////


persistLinkedList(db, SLL) {
  return db.transaction(trx =>
    Promise.all([
      db('language')
        .transacting(trx)
        .where('id', SLL.head.value.language_id)
        .update({
          total_score: SLL.total_score,
          head: SLL.head.value.id,
        }),

      ...SLL.forEach(node =>
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
}

//////////////////////////////////////////////////////////////////////////////////////////////

module.exports = LanguageService

