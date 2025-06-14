import express from 'express';
import { Verify, ForgotPassword, Delete, SignIn, SignUp, GetUsers, NewPassword } from '../controllers/users.js';
const router = express.Router()
import verifyToken from '../middlewares/jwt_middleware.js'

router.get('/', GetUsers);
router.post('/signup', SignUp);
router.put('/signin', SignIn);
router.delete('/delete', verifyToken, Delete);
router.put('/forgot/password', ForgotPassword);
router.put('/verify/code', Verify);
router.put('/new/password', NewPassword);

export default router;