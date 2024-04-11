import { Schema, model } from 'mongoose';
import {constant} from '../helpers/constant.js';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    collectionStatus: {
      type: String,
      default: constant.COLLECTION_STATUS[0]
    }
  },
  {
    timestamps: true,
  }
);

const UserModel = model('User', userSchema);
export default UserModel;
