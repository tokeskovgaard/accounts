import 'reflect-metadata'
import * as express from 'express'
import * as session from 'express-session'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import * as morgan from 'morgan'
import * as flash from 'connect-flash'

import { DB_NAME, MONGO_HOST, PORT } from './modules/common/consts'
import * as passport from 'passport'
import { connect } from 'mongoose'
import { Strategy } from 'passport-local'

// passport.use('password', PasswordStrategy);
// passport.use('jwt', JWTStrategy);

interface User {
  username
  password
  _id
}

const users: User[] = [{ username: 'test', password: 'test', _id: '1337' }]

export const PasswordStrategy = new Strategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  function(username, password, done) {
    //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
    const user = users.find(user => user.password === password && user.username === username)
    if (user) {
      console.log('Authenticating user', user)
      return done(null, user, { message: 'Logged In Successfully' })
    }
    return done(null, false, { message: 'Incorrect email or password.' })
  }
)
passport.use('password', PasswordStrategy)

passport.serializeUser(function(user: User, done) {
  done(null, user._id)
})
passport.deserializeUser(function(id, done) {
  const user = users.find(user => user._id == id)
  if (user) return done(null, user)
  return done(new Error('Could not deserialize session! ' + id))
})

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(null)
  }
  res.send(401)
}

;(async () => {
  if (false) {
    const mongooseConnection = await connect(
      `mongodb+srv://${MONGO_HOST}/${DB_NAME}?retryWrites=true&w=majority`,
      { useNewUrlParser: true }
    )
  }
  console.log(`🚀 MongoDB connected at: ${MONGO_HOST}/${DB_NAME}`)

  const app = express()
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cors({ origin: '*' }))
  app.use(morgan('tiny'))
  app.use(flash())

  // Express Session
  const sessionConfig = { secret: 'lossecret1337', saveUninitialized: false, resave: false }
  app.use(session(sessionConfig))

  // Passport init
  app.use(passport.initialize())
  app.use(passport.session())

  app.use('/spike/register', express.static('public/spike/register.html'))
  app.use('/spike/sign-in', express.static('public/spike/sign-in.html'))

  app.post('/spike/register', (req, resp) =>
    users.push({
      username: req.body.username,
      password: req.body.password,
      _id: Math.random().toString(),
    })
  )
  app.post(
    '/spike/sign-in',
    passport.authenticate('password', {
      successRedirect: '/spike/profile',
      failureRedirect: '/spike/sign-in',
      failureFlash: true,
    })
  )
  app.get('/spike/profile', isAuthenticated, function(req, resp) {
    resp.send(req.user)
  })
  app.get('/spike/sign-out', (req, res) => {
    req.logout()
    res.redirect('/spike/sign-in')
  })

  /*   // API Routes
       app.use('/', express.static('public'))
       app.use('/auth/user', isAuthenticated, (req, res) => res.send(req.user));

       app.use('/auth', require('./routes/auth'))
       app.use('/user', passport.authenticate('jwt', {session: false}), require('./routes/user'))
   */
  await app.listen({ port: PORT })
  console.log(`🚀 Server ready at localhost:${PORT}`)
})()
