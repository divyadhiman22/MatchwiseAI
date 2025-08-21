import express from 'express';
import userRoutes from './user-routes.js';
import matchRoutes from './match-routes.js';
import { auth } from '../utils/middlewares/auth.js';

export const indexRoute = express.Router();
indexRoute.use('/user',userRoutes);


indexRoute.use('/match',auth, matchRoutes);



