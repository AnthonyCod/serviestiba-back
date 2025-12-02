import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secreto.super.seguro';

// Aceptamos un objeto con id Y rol
export const generateToken = (payload: { id: number; fk_rol: number }) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
};