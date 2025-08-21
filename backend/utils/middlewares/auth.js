import { verifyToken } from "../services/token.js";

export const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'UnAuthorized User' });
  }

  const token = authHeader.split(' ')[1]; 
  
  try {
    const email = verifyToken(token);
    req.user = email;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'UnAuthorized User' });
  }
};
