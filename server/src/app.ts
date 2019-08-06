import 'reflect-metadata'
const mongoose = require('mongoose').set('debug', true)
import { SessionOptions } from 'express-session'

import { DB_NAME, MONGO_HOST, PORT, SESSION_SECRET } from './environment'
import { passwordStrategy } from './modules/passport/password-strategy'
import { facebookStrategy } from './modules/passport/facebook-strategy'
import { passportSession } from './modules/passport/passport-session'

const express = require('express')
const expressSession = require('express-session')

const cors = require('cors')
const morgan = require('morgan')
const flash = require('connect-flash')
const bodyParser = require('body-parser')
const HTTP = require('http-status-codes')
const passport = require('passport')
const MongoStore = require('connect-mongo')(expressSession)


function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(null)
  }
  res.sendStatus(HTTP.UNAUTHORIZED)
}

function session(mongooseConnection) {
  return expressSession({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({ mongooseConnection: mongooseConnection }),
  } as SessionOptions)
}

(async () => {
  const mongooseConnection = await mongoose.connect(
    `mongodb+srv://${MONGO_HOST}/${DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  )
  console.log(`🚀 MongoDB connected at: ${MONGO_HOST}/${DB_NAME}`)

  const app = express()
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cors({ origin: '*' }))
  app.use(morgan('tiny'))
  app.use(flash())
  app.use(session(mongooseConnection.connection))

  // Passport setup
  app.use(passport.initialize())
  app.use(passportSession())
  app.use('/auth/password', passwordStrategy())
  app.use('/auth/facebook', facebookStrategy())

  // Routes setup
  app.use('/register', express.static('public/spike/register.html'))
  app.use('/sign-in', express.static('public/spike/sign-in.html'))

  app.get('/spike/profile', isAuthenticated, function(req, resp) {
    resp.send(req.user)
  })
  app.get('/spike/sign-out', (req, res) => {
    req.logout()
    res.redirect('/spike/sign-in')
  })

  await app.listen({ port: PORT })
  console.log(`🚀 Server ready at localhost:${PORT}`)
})()
