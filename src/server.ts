import dotenv from 'dotenv'
dotenv.config();
import { db } from "./database/sequelize";
import app from "./routes";

import http from 'http'
import UserModel from './models/User.model';


const server = http.createServer(app);
(async () => {
  //await db.sync({force:false})


  const port = 3001;
  server.listen(port, () => {
    db.addModels([UserModel]);

    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  })
})()
