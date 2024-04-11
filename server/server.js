import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/conn.js';
import router from './router/route.js';
import dotenv from 'dotenv';
dotenv.config();

/** to generate secret key which is used in login route api */
// import crypto from 'crypto'
// const secretKey = crypto.randomBytes(32).toString('base64');
// console.log(secretKey);



const app = express();


/**middlewares */
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by');

const PORT = process.env.PORT;

/** HTTP Get Request */
app.get('/', (req, res) => res.status(201).json("Home Get Request"));

/** API routes */
app.use('/api', router);

/** Start server only we have valid connection */
connect().then(() => {
    try {
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    } catch { error => console.log("Cannot connect to the server") }
}).catch(error => console.log("Invalid database connection...!"));


