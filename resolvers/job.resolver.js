import JobModel from '../models/job.model.js';
import userHelper from '../helpers/user.helper.js';
import jwt from 'jsonwebtoken';
import throwCustomError, {
  ErrorTypes,
} from '../helpers/error-handler.helper.js';
import { GraphQLError } from 'graphql';
import {constant} from '../helpers/constant.js';

const jobResolver = {
  Query: {
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

      return {
        ...job._doc
      };
    },

  },

};

export default jobResolver;
