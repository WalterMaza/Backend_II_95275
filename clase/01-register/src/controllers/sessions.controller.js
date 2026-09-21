import { UserModel } from '../models/user.model.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export const register = async (req, res) => {
  try {
    res.status(501).json({ status: 'error', error: 'Falta implementar el registro' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
  }
};
