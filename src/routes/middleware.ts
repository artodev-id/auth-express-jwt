import jwt from 'jsonwebtoken';
import { env } from 'src/config/env';
import { expressjwt,Request as JWTRequest } from 'express-jwt';
import User from 'src/models/User.model';


interface IAuthUser{
    id: number;
    email : string;
    name : string;
}

export const sign = (user:IAuthUser):string => {
    return jwt.sign(user,env.TOKEN_SECRET, {
        expiresIn:"3 days",
        algorithm:"HS256"
    })
}

export const auth = expressjwt({
        secret: env.TOKEN_SECRET,
        algorithms: ["HS256"],
        getToken:(req) => {
          if (
              req.headers.authorization &&
              req.headers.authorization.split(" ")[0] === "Bearer"
            ) {
              return req.headers.authorization.split(" ")[1];
            } else if (req.query && req.query.token) {
              

              return req.query.token.toString();
            }
            return undefined;
        },
        isRevoked:async (req:JWTRequest, token) => {
            const payload:any = token?.payload;
            const user = await User.findByPk(payload?.id, {
                raw:true
            });
            if(user){
              return false;
            }
            return true;
        }
      })