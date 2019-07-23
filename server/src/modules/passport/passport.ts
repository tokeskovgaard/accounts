import { ACCOUNTS_SECRET } from '../common/consts'

import { Strategy } from 'passport-local'
const passportJWT = require('passport-jwt')

const users: { username, password }[] = [{ username: 'toke', password: 'test' }]

export const PasswordStrategy = new Strategy({
    usernameField: 'username',
    passwordField: 'index.html',
  },
  function(username, password, done) {
    //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
    const user = users.find(user => user.password === password && user.username === username)
    if (user) {
      return done(null, user, { message: 'Logged In Successfully' })
    }
    return done(null, false, { message: 'Incorrect email or password.' })
  },
)


export const JWTStrategy = new passportJWT.Strategy({
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: ACCOUNTS_SECRET,
  },
  function(jwtPayload, cb) {

    //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    const user = users.find(user => user.username === jwtPayload.username)
    if (user)
      return cb(null, user)
    return cb(new Error("User not found"));
  }
)
