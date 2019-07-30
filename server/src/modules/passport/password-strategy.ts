import { Strategy as LocalStrategy } from 'passport-local'
import { Role, User, UserModel } from '../user/user-entity'
import * as passport from 'passport'

const HTTP = require('http-status-codes')
const bcrypt = require('bcrypt')

const saltRounds = 12
const ErrorOccurredMessage = 'An error occurred - Sad face :('

function authenticateUser(username, password, done) {
  console.log('Authenticating user')
  //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
  let query = { 'services.password.username': username } as Partial<User>
  UserModel.find(query)
    .exec()
    .then(users => {
      console.log('Found user', users, username)
      const user = users[0]
      if (!user) return done(null, false, { message: 'Incorrect username' })

      console.log('Comparing password')
      if (!bcrypt.compareSync(password, user.services.password.bcrypt))
        return done(null, false, { message: 'Incorrect password.' })

      console.debug('Authenticating user', user)
      return done(null, user, { message: 'Logged In Successfully' })
    })
    .catch(err => {
      console.error(err)
      return done(err, false, { message: 'Error occurred' })
    })
}

function registerUser(req, resp) {
  const username = req.body.username
  const password = req.body.password
  if (!username) {
    return resp.status(HTTP.BAD_REQUEST).send('Username is required')
  }
  if (!password) {
    return resp.status(HTTP.BAD_REQUEST).send('Password is required')
  }
  UserModel.findOne({ 'services.password.username': username })
    .exec()
    .then(existingUser => {
      if (existingUser) {
        return resp.status(HTTP.BAD_REQUEST).send('Username not available')
      }

      const hash = bcrypt.hashSync(password, saltRounds)
      new UserModel({
        roles: [Role.User],
        services: { password: { username: username, bcrypt: hash } },
      })
        .save()
        .then(() => resp.sendStatus(HTTP.CREATED))
        .catch(error => {
          throw error
        })
    })
    .catch(err => {
      return resp.status(HTTP.INTERNAL_SERVER_ERROR).send(ErrorOccurredMessage)
    })
}

export const PasswordStrategyName = 'password'

export function passwordStrategy() {
  passport.use(
    PasswordStrategyName,
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      authenticateUser
    )
  )

  const router = require('express').Router()
  router.post('/register', registerUser)
  router.post(
    '/sign-in',
    passport.authenticate(PasswordStrategyName, { successRedirect: '/spike/profile' })
  )
  return router
}
