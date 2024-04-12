import Queue from "bull";
const JobQueue = new Queue('job-queue');
import JobModel from '../models/job.model.js';
import { constant } from '../helpers/constant.js';
import { Schema, model, Types } from 'mongoose';
const { ObjectId } = Types;

export const addJobQueue = async (data) => {
  const options = { attempts: 1,removeOncomplete:true,removeOnFail:true }
  const job = await JobQueue.add(data,options);
}
JobQueue.process(10, async(job)=>{
  setTimeout(async () => {
    const jobId = job?.data?._id;
    try {
      await JobModel.findByIdAndUpdate({ _id: ObjectId(jobId) }, { status: constant.JOB_STATUS[2] }, { new: true });
      // return Promise.resolve()
    } catch (error) {
      console.log("error", error);

    }

  }, 3 * 300 * 60);


  return Promise.resolve();
});




