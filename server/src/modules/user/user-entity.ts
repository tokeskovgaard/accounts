import { prop, Typegoose } from 'typegoose'
import { ObjectId } from 'mongodb'

export enum Role {
  User = 'user',
  Admin = 'admin',
}

export class Profile {
  @prop({ required: true })
  firstName!: string

  @prop({ required: true })
  lastName!: string
}

export class Plaid {
  @prop({ required: true })
  accessToken!: string

  @prop({ required: true })
  itemId!: string
}

class PasswordService {
  @prop()
  bcrypt!: string

  @prop()
  username!: string
}

class FacebookService {
  @prop({ required: true })
  accessToken!: any

  @prop({ required: true })
  refreshToken!: any

  @prop({ required: true })
  profile!: any
}

export class User extends Typegoose {
  readonly _id: ObjectId

  @prop({ required: true })
  roles!: Role[]

  @prop()
  services: {
    password?: PasswordService
    facebook?: FacebookService
  }

  @prop()
  profile: Profile

  @prop()
  createdAt: Date

  @prop()
  updatedAt: Date
}

export const UserModel = new User().getModelForClass(User, { schemaOptions: { timestamps: true } })
