const express = require('express');
const bodyParser = express.json();
const LanguageService = require('./language-service');
const SLL = require('../LinkedList/LinkedList');
const { requireAuth } = require('../middleware/jwt-auth');
const LinkedList = require('../LinkedList/LinkedList')

const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const nextMorse= await LanguageService.getOnDeck(
        req.app.get('db'),
        req.language.head
      )
      console.log(nextMorse)
      res.status(200).json({
        total_score: req.language.total_score,
        ...nextMorse
      })
    } catch(error){
      next(error)
    }
  })

languageRouter
  .post('/guess', bodyParser, async (req, res, next) => {
    const { guess } = req.body
    if(!req.body){
      return res.status(404).json({error: 'Error'});
    }
    //console.log(guess)
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id
      )
      //console.log(words)
      let SLL = new LinkedList()
      //console.log(SLL)
      const oldScore = await LanguageService.getTotalScore(
        req.app.get('db'),
        req.user.id
      )

      //console.log(`oldScore.total_score: ${oldScore.total_score}`)

      console.log(words)
      SLL.arrToSLL(words, SLL)
      console.log(SLL)
      SLL.total_score = oldScore.total_score

      //console.log(`oldScore.total_score:  ${SLL.total_score}`)
      //console.log(`SLL.total_score = oldScore.total_score:  ${SLL.total_score}`)

      let correct = SLL.isCorrect(guess, SLL)

      //console.log(correct)
      console.log(SLL.head.value.translation)
      SLL.UpdateScoreAndSLL(guess, SLL)
      console.log(SLL.head.value.translation)
      //console.log(`SLL.total_score ++/-- :  ${SLL.total_score}`)
      
      //console.log(SLL)

      const update = await LanguageService.persistLinkedList(
        req.app.get('db'),
        SLL
      )

      console.log(update)

      return res.status(200).json({
        correct: correct,
        total_score: SLL.total_score,
        SLL: SLL
      })
    } catch(error){
      next(error)
    }
  })

module.exports = languageRouter