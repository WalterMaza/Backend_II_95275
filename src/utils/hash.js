import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';

export const createHash=async(password)=>await bcrypt.hash(password, config.saltRounds)
export const validaPass=async(password, hash)=>await bcrypt.compare(password, hash)