import jwt from 'jsonwebtoken';
import { ENV } from '../lib/env.js';
import User from '../models/User.js';

export const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.headers.cookie?.split(';').find(c => c.trim().startsWith('token='))
            ?.split('=')[1];

        if (!token) {
            console.log('No token found in cookies');
            return next(new Error('Authentication error'));
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if(!decoded || !decoded.id) {
            console.log('Invalid token payload');
            return next(new Error('Authentication error'));
        }
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            console.log('User not found');
            return next(new Error('User not found'));
        }

        socket.user = user;
        socket.userId = user._id.toString();

        console.log(`User ${user.username} authenticated successfully`);
        next();
    } catch (error) {
        console.log('Authentication error:', error);
        next(new Error('Authentication error'));
    }
}