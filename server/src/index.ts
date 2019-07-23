import 'reflect-metadata'
import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as morgan from 'morgan'
import * as jwt from 'jsonwebtoken'


import { DB_NAME, MONGO_HOST, PORT } from './modules/common/consts'
import * as passport from 'passport'
import { connect } from 'mongoose'
import { PasswordStrategy,JWTStrategy } from './modules/passport/passport'


passport.use('index.html', PasswordStrategy)
passport.use('jwt', JWTStrategy);

(async () => {
  if (false) {
    const mongooseConnection = await connect(`mongodb+srv://${MONGO_HOST}/${DB_NAME}?retryWrites=true&w=majority`, { useNewUrlParser: true })
  }
  console.log(`🚀 MongoDB connected at: ${MONGO_HOST}/${DB_NAME}`)

  const app = express()
  app.use(cookieParser())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cors())
  app.use(morgan('tiny'))

  app.use('/', express.static('public'));
  app.use('/auth', require('./routes/auth'));
  app.use('/user', passport.authenticate('jwt', { session: false }), require('./routes/user'))


  await app.listen({ port: PORT })
  console.log(`🚀 Server ready at localhost:${PORT}`)
})()
