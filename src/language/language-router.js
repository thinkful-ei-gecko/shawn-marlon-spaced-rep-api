const express = require('express');
const bodyParser = express.json();
const LanguageService = require('./language-service');
//const SLL = require('../LinkedList/LinkedList');
const { requireAuth } = require('../middleware/jwt-auth');


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
      next();
    } catch(error){
      next(error)
    }
  })

//get lang words
//populate a SLL
//compare guess to ss.head.translation.value
//if correct add 1 to mem val
//if incorrect set mem val to 1
//shift ssl.head down equal to the mem value

// languageRouter
//   .post('/guess', bodyParser, async (req, res, next) => {
//     try {
//       const guess = req.body.guess
//       const userWordList = await LanguageService.getLanguageWords(
//         req.app.get('db'),
//         req.language.id,
//       )
//       let bool;
//       let userSLL = new SLL();
      
//       userWordList.forEach(word => {
//         userSLL.insertAfter(word)
//       });

//       let bool = userWordList.head.value

//       res.status(200).json({
//         userWordList: userWordList,
//         guess: guess,
//         languageID: req.language.id,
//       })
//       next();
//     } catch(error){
//       next(error)
//     }
//   });

module.exports = languageRouter