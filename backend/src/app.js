import express from 'express';
import authRoutes from './routes/auth.route.js';
import path from 'path';
import {connectToDB} from './lib/db.js';
import {ENV} from "./lib/env.js";
import cookieParser from 'cookie-parser';
import messageRoutes from './routes/message.route.js';

const app = express();
const __dirname = path.resolve();

const PORT = ENV.PORT;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

if (ENV.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (_, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
    });
}

(async () => {
    try {
        await connectToDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
})();