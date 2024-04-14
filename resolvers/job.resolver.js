import JobModel from '../models/job.model.js';
import { GraphQLError } from 'graphql';
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
      //simualte the job for specific time
      const time = Math.random() * 60 | 0;
      const jobToCreate = new JobModel({
        userId:userId,
        name: name,
        estimatedTime:time
        });
      const job = await jobToCreate.save();
      try {
         addJobQueue({
          _id:job._doc?._id,
          status:job._doc?.status,
          estimatedTime:job._doc?.estimatedTime
        });

      } catch (error) {
        throw new GraphQLError(error.message);
      }

      return {
        ...job._doc
      };
    },

  },

};
export default jobResolver;
