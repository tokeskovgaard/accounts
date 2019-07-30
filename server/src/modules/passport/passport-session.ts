import * as passport from 'passport'
import { User, UserModel } from '../user/user-entity'

export function passportSession() {
  passport.serializeUser(function(user: User, done) {
    done(null, user._id)
  })

  passport.deserializeUser(function(id, done) {
    UserModel.findById(id)
      .exec()
      .then(user => {
        if (user) return done(null, user)
        console.warn('Could not deserialize session! ' + id)
        return done(null, false)
      })
      .catch(err => {
        return done(err)
      })
  })

  return passport.session()
}
