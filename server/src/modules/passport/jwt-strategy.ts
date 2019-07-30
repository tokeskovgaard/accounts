import { ACCOUNTS_SECRET } from '../common/consts'
import { UserModel } from '../user/user-entity'
import * as passport from 'passport'

const passportJWT = require('passport-jwt')
const jwt = require('jsonwebtoken')

export const JWTStrategyName = 'jwt'
export function useJWTStrategy(){
  passport.use(JWTStrategyName, new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: ACCOUNTS_SECRET,
    },
    function(jwtPayload, done) {
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      UserModel.find({ username: jwtPayload.username }).exec()
        .then(user => {
          if (user) return done(null, user)
          return done(null, false)
        },
      ).catch(err => done(err))
    },
    )
  )

  const router = require('express').Router()
  router.post('/auth/jwt', passport.authenticate(JWTStrategyName), function(req, res, next) {
    // generate a signed json web token with the contents of user object and return it in the response
    const token = jwt.sign(req.user, ACCOUNTS_SECRET)
    return res.json({ user: req.user, token })
  })
  // app.use('/user', passport.authenticate('jwt', {session: false}), require('./routes/user'))


  return router
}
