import { prop, Typegoose } from 'typegoose'
import { ObjectId } from 'mongodb'
import { Role } from './consts'

export class Profile {
  @prop({ required: true })
  firstName: string

  @prop({ required: true })
  lastName: string
}

export class Plaid {
  @prop({ required: true })
  accessToken: string

  @prop({ required: true })
  itemId: string
}


export class User extends Typegoose {
  readonly _id: ObjectId

  @prop()
  profile: Profile

  @prop()
  plaid?: Plaid

  @prop({ required: true, enum: Role })
  roles: Role[]

  @prop()
  isOnboarded?: boolean

  @prop()
  createdAt: Date

  @prop()
  updatedAt: Date
}

export default new User().getModelForClass(User, {
  schemaOptions: { timestamps: true },
})
