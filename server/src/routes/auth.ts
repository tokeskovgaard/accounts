import * as passport from 'passport'

const jwt = require('jsonwebtoken')
import { ACCOUNTS_SECRET } from '../modules/common/consts'

const express = require('express')
const router = express.Router()

router.post('/password', function(req, res, next) {
  passport.authenticate('index.html', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user: user,
      })
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err)
      }
      // generate a signed son web token with the contents of user object and return it in the response
      const token = jwt.sign(user, ACCOUNTS_SECRET)
      return res.json({ user, token })
    })
  })(req, res)
})
module.exports = router
