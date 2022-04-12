import Job from '../models/job.js';
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/BadRequest.js';
import UnauthorizedError from '../errors/Unauthorized.js';
import NotFoundError from '../errors/NotFound.js';
import checkPermissions from '../utils/checkPermissions.js';
import mongoose from 'mongoose';

const createJob = async (req, res) => {
  const { company, position, location } = req.body;

  if (!company || !position || !location) {
    throw new BadRequestError('Missing fields');
  }
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findOne({ _id: jobId });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  checkPermissions(req.user, job.createdBy);
  await Job.deleteOne({ _id: jobId });
  res.status(StatusCodes.OK).json({ msg: 'Job Sucessfully Removed' });
};

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId });
  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: jobs.length, numPages: 1 });
};

const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { company, position, location } = req.body;
  if (!company || !position || !location) {
    throw new BadRequestError('Please Provide All Values');
  }
  const job = await Job.findOne({ _id: jobId });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  checkPermissions(req.user, job.createdBy);
  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({ updatedJob });
};

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  //turn stats array into object
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interviewing: stats.interviewing || 0,
    declined: stats.declined || 0,
  };
  let monthlyApps = [];
  res.status(StatusCodes.OK).json({ defaultStats, monthlyApps });
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
