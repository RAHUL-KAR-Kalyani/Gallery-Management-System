require('dotenv').config();
const cors = require('cors');
const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user.router');
const imageRouter = require('./routes/image.router');
const albumRouter = require('./routes/album.router');
const adminRouter = require('./routes/admin.router');
const imagesizeMiddleware = require('./middleware/imagesizeMiddleware');

const app = express();
const PORT = process.env.PORT
const corsOption = {
    origin: process.env.FRONTEND_URL,
    credentials: true
}

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(cors(corsOption));

// Routes
app.get('/', (req, res) => {
    return res.send('Server is running...........');
});

app.use("/user", userRouter);
app.use("/image", imageRouter);
app.use("/album", albumRouter);
app.use("/admin", adminRouter);

app.use(imagesizeMiddleware);

// Server
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running: http://localhost:${PORT}/`);
    console.log(`MongoDB link: https://cloud.mongodb.com/v2/69f6295cf9e064c71c648182#/explorer/69f62984ad58453d952eeaf4`)
    console.log(`Copilot link: https://copilot.microsoft.com/chats/JMDcW91nh2yYaSeNQ8jj2`)
});