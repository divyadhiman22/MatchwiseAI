import express from 'express';
import { matchResume } from '../controllers/match-controller.js';

const router = express.Router();
router.post('/', matchResume);
export default router;
