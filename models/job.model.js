import { Schema, model , Types} from 'mongoose';
const { ObjectId } = Types;
import {constant} from '../helpers/constant.js';

const jobSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: constant.JOB_STATUS[0]
    }
  },
  {
    timestamps: true,
  }
);

const JobModel = model('job', jobSchema);
export default JobModel;
