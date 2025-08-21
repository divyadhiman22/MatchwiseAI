import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chalk from 'chalk';
import fileUpload from 'express-fileupload';
import { indexRoute } from './routers/index.js';
import { Error404 } from './utils/middlewares/404.js';
import { createConnection } from './utils/db/connection.js';
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload({ limits: { fileSize: 5 * 1024 * 1024 } }));


app.use('/routers', indexRoute);
app.use(Error404);

const promise = createConnection();
promise.then(() => {
  console.log(chalk.green('DB Connected'));
  app.listen(5500, () => {
    console.log(chalk.greenBright.bold('Server running...'));
  });
}).catch(err => {
  console.log(chalk.redBright(' DB Connection Failed'), err);
});
