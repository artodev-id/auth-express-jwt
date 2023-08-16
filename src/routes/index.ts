import express, {Errback, Request, Response, NextFunction} from 'express'
import bodyParser from "body-parser";
import cors from 'cors';
import { expressjwt as jwt, Request as JWTRequest } from 'express-jwt'

import { routes } from "src/utils/route-wrapper";
import * as middleware from './middleware';
import UserAuth from './auth';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: true }));


app.use((err:SyntaxError, req:Request, res:Response, next:NextFunction) => {
    if (err instanceof SyntaxError  && 'body' in err) {
        return res.status(400).json({ status: 400, message: err?.message }); // Bad request
    }
    next();
});

/* ==========   API   ============ */
    //user
    app.use('/api/',middleware.auth.unless({ path: [/^\/api\/(?!me).*/]}));
    app.use('/api', routes(UserAuth));



app.use(async function (err:SyntaxError, req:JWTRequest, res:Response, next:NextFunction) {
    if (err.name === "UnauthorizedError") {
      res.status(401).json({status:401, message: "Unauthorized"});
    } else {
        next(err)
    }
});

app.use('*', function(req, res){
    res.status(404).json('Hey! what are you doing here?');
});

export default app;