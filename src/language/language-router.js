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
      res.status(200).json({
        totalScore: req.language.total_score,
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
      let SLL = new LinkedList()
      //console.log(SLL)
      SLL.arrToSLL(words, SLL)
      let correct = SLL.isCorrect(guess, SLL)
      console.log(correct)
    
      SLL.validateGuessAndUpdateSLL(guess, SLL)
      LanguageService.persistLinkedList(
        req.app.get('db'),
        SLL
      )
      //console.log(correct)
      return res.status(200).json({
        correct: correct,
        score: SLL.total_score,
        SLL: SLL
        //SLL: JSON.stringify(...SLL)
      })
      .then()
    } catch(error){
      next(error)
    }
  })

module.exports = languageRouter