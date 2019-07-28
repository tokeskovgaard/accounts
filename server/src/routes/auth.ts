import * as passport from 'passport'
import { ACCOUNTS_SECRET } from '../modules/common/consts'

const jwt = require('jsonwebtoken')

const express = require('express')
const router = express.Router()

router.post('/password', passport.authenticate('password'), function(req, res) {
  res.send(req.user)
})

const ensureAuthenticated: any = () => {}
router.post('/jwt', ensureAuthenticated, function(req, res, next) {
  // generate a signed son web token with the contents of user object and return it in the response
  const token = jwt.sign(req.user, ACCOUNTS_SECRET)
  return res.json({ user: req.user, token })
})
module.exports = router
