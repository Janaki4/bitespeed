import express from 'express';
const router: any = express.Router();
import userController from '../Controller/userController';

router.post('/identify', userController.identity())

export default router;
