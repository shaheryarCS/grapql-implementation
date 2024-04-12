import JobModel from '../models/job.model.js';
import userHelper from '../helpers/user.helper.js';
import jwt from 'jsonwebtoken';
import throwCustomError, {
  ErrorTypes,
} from '../helpers/error-handler.helper.js';
import { GraphQLError } from 'graphql';
import {constant} from '../helpers/constant.js';
import { addJobQueue } from '../config/queue.js';

const jobResolver = {
  Query: {
    // Destructing {total} is same sa args.total
    getJobById:  async (_, { id }, context) => {
      try {
        console.log("id",id);
        const job = await JobModel.findById(id);
        return job;
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },

  Mutation: {
    create: async (_, { input },context) => {
      const userId = context?.user?.userId;
      const { name } = input;
      const jobToCreate = new JobModel({
        userId:userId,
        name: name
        });
      const job = await jobToCreate.save();
      try {
         addJobQueue({_id:job._doc?._id,status:job._doc?.status});

      } catch (error) {
        console.log("error",error);
      }

      return {
        ...job._doc
      };
    },

  },

};
export default jobResolver;
