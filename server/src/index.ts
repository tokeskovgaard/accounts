import 'reflect-metadata'

const express = require('express')
const session = require('express-session')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const flash = require('connect-flash')
const bcrypt = require('bcrypt')

import { Strategy as LocalStrategy } from 'passport-local'
import { connect, DeepPartial } from 'mongoose'
import { DB_NAME, MONGO_HOST, PORT } from './modules/common/consts'
import { ModelType, prop, Typegoose } from 'typegoose'
import { ObjectId } from 'mongodb'

const saltRounds = 12

const HttpStatus = require('http-status-codes')

const passport = require('passport')
const MongoStore = require('connect-mongo')(session)

// passport.use('password', PasswordStrategy);
// passport.use('jwt', JWTStrategy);
const SessionSecret = 'lossecret1337'

const ErrorOccurredMessage = 'An error occurred - Sad face :('

class PasswordService {
  @prop({ required: true })
  bcrypt: string
}

class User extends Typegoose {
  readonly _id: ObjectId

  @prop({ required: true })
  username: string

  @prop()
  services: {
    password?: PasswordService
  }
}

const UserModel = new User().getModelForClass(User, { schemaOptions: { timestamps: true } })

class UserService {
  private readonly model: ModelType<User>

  constructor() {
    this.model = UserModel
  }

  find(user: Partial<User>): Promise<User[]> {
    return this.model.find(user).exec()
  }

  findOne(user: Partial<User>): Promise<User | null> {
    return this.model.findOne(user).exec()
  }

  findById(id): Promise<User | null> {
    return this.model.findById(id).exec()
  }

  remove(_id: string): Promise<User | null> {
    return this.model.findByIdAndDelete(_id).exec()
  }

  create(model: DeepPartial<User>): Promise<User> {
    return new UserModel(model).save()
  }
}

const userService = new UserService()
export const PasswordStrategy = new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  function(username, password, done) {
    //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
    userService
      .findOne({ username: username })
      .then(user => {
        if (!user)
          return done(null, false, { message: 'Incorrect username' })

        if(!bcrypt.compareSync(password, user.services.password.bcrypt))
          return done(null, false, { message: 'Incorrect password.' })

        console.debug('Authenticating user', user)
        return done(null, user, { message: 'Logged In Successfully' })
      })
      .catch(err => {
        console.error(err)
        return done(err, false, { message: ErrorOccurredMessage })
      })
  }
)
passport.use('password', PasswordStrategy)

passport.serializeUser(function(user: User, done) {
  done(null, user._id)
})

passport.deserializeUser(function(id, done) {
  userService
    .findById(id)
    .then(user => {
      if (user) return done(null, user)
      return done(new Error('Could not deserialize session! ' + id))
    })
    .catch(err => {
      return done(err)
    })
})

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(null)
  }
  res.sendStatus(HttpStatus.UNAUTHORIZED)
}

;(async () => {
  const mongooseConnection = await connect(
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

  // Express Session
  app.use(
    session({
      secret: SessionSecret,
      saveUninitialized: false,
      resave: false,
      store: new MongoStore({ mongooseConnection: mongooseConnection.connection }),
    })
  )

  // Passport init
  app.use(passport.initialize())
  app.use(passport.session())

  app.use('/spike/register', express.static('public/spike/register.html'))
  app.use('/spike/sign-in', express.static('public/spike/sign-in.html'))

  app.post('/spike/register', (req, resp) => {
    const username = req.body.username
    const password = req.body.password
    if (!username) {
      return resp.status(HttpStatus.BAD_REQUEST).send('Username is required')
    }
    if (!password) {
      return resp.status(HttpStatus.BAD_REQUEST).send('Password is required')
    }
    userService
      .findOne({ username: username })
      .then(existingUser => {
        if (existingUser) {
          return resp.status(HttpStatus.BAD_REQUEST).send('Username not available')
        }
        const hash = bcrypt.hashSync(password, saltRounds);
        userService
          .create({ username: username, services: { password: { bcrypt: hash } } })
          .then(() => resp.sendStatus(HttpStatus.CREATED))
          .catch(error => {
            console.error(error)
            resp.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ErrorOccurredMessage)
          })
      })
      .catch(err => {
        return resp.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ErrorOccurredMessage)
      })
  })
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
