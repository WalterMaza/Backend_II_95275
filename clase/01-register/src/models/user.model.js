import mongoose from 'mongoose';

const userSchema = new mongoose.Schema();

export const UserModel = mongoose.model('User', userSchema);
