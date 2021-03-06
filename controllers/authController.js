import User from '../models/user.js';
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/BadRequest.js';
import UnauthorizedError from '../errors/Unauthorized.js';

const register = async (req, res) => {
  const { firstName, email, password } = req.body;
  if (!firstName || !email || !password) {
    throw new BadRequestError('please provide all values firstname');
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new BadRequestError('Email is already registered');
  }
  const user = await User.create({ firstName, email, password });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Pleaes provide all values');
  }
  // checks if user email is already registered
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }
  // checks password match
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Invalid credentials');
  }
  const token = user.createJWT();
  user.password = undefined; // removes password from response
  res.status(StatusCodes.OK).json({ user, token });
};

const updateUser = async (req, res) => {
  const { email, firstName, lastName, location } = req.body;
  if (!email || !firstName || !lastName) {
    throw new BadRequestError('Please provide all values');
  }
  const user = await User.findOne({ _id: req.user.userId });
  user.email = email;
  user.firstName = firstName;
  user.lastName = lastName;
  user.location = location;
  await user.save();

  // creates new token
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user, token });
};

export { register, login, updateUser };
