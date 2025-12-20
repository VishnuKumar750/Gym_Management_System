import Member, { IMember } from '../models/member.model';
import User, { IUser } from '../models/user.model';
import { HTTPSTATUS } from '../config/http.config'

export const createUser = async (userData: IUser) => {
  const existingUser = await User.findOne({ email });

  if(existingUser) {
  	throw new ErrorHandler(HTTPSTATUS.CONFLICT, "user already exists")
  };


  return await User.create(userData);
};

export const getAllUsers = async () => {
  return await User.find();
};

export const getUserById = async (_id: string) => {
  return await User.findById(_id);
};

export const createMembers = async (memberData: IMember) => {
  return await Member.create(memberData);
};

export const getUserByEmail = async (email: String) => {
  return await User.findOne({ email: email }).select('+password');
};
