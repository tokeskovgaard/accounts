const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy

import { Role, UserModel } from '../user/user-entity'

const FACEBOOK_APP_ID = '468518163715124'
const FACEBOOK_APP_SECRET = 'aaf8faa3383af359d43024cc05a24bfd'
const FACEBOOK_CALLBACK_URL = 'http://localhost:4000/auth/facebook/callback'

export const FACEBOOK_STRATEGY_NAME = 'facebook'

export function facebookStrategy() {
  passport.use(FACEBOOK_STRATEGY_NAME, new FacebookStrategy({
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: FACEBOOK_CALLBACK_URL,
      passReqToCallback: true,
    },
    function(req, accessToken, refreshToken, profile, done) {
      const facebookService = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        profile: profile,
      }

      if (req.user) {
        // Update authenticated user
        UserModel.findByIdAndUpdate(req.user._id, { services: { facebook: facebookService } }).exec()
          .then(user => done(null, user))
          .catch(err => done(err))
      } else {
        UserModel.findOne({ services: { facebook: { accessToken: accessToken } } }).exec()
          .then(user => {
            // Authenticate user
            if (user) {
              user.services.facebook = facebookService
              UserModel.findByIdAndUpdate(user._id, user).exec()
                .then(() => done(null, user))
                .catch(err => done(err))
              return;
            }
            // Create new user
            new UserModel({ roles: [Role.User], services: { facebook: facebookService } }).save()
              .then(user => done(null, user))
              .catch(err => done(err))
          }).catch(err => done(err))
      }
    }),
  )

  const router = require('express').Router()
  // Redirect the user to Facebook for authentication.  When complete, Facebook will redirect the user back to the application at /auth/facebook/callback
  router.get('', passport.authenticate(FACEBOOK_STRATEGY_NAME))

  // Facebook will redirect the user to this URL after approval.  Finish the authentication process by attempting to obtain an access token.  If access was granted, the user will be logged in.  Otherwise, authentication has failed.
  router.get('/callback', passport.authenticate(FACEBOOK_STRATEGY_NAME, { successRedirect: '/spike/profile' }))
  return router
}
