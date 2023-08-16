import {action, Get, Post} from "src/utils/route-wrapper";
import {Request, Response} from 'express' 
import {Request as JWTRequest} from 'express-jwt';

import moment from "moment";
import { Helper } from "src/utils/helper";
import * as middleware from "@routes/middleware";
import { Op } from "sequelize";
import UserModel from "src/models/User.model";
import { db } from "src/database/sequelize";


export default class UserAuth{
    constructor(){}

    @Post('/login', {validator:['email', 'password']})
    async login(req:Request, res:Response){
        const {email, password} = req.body;
        const user = await UserModel.findOne({
            where:{email},
            raw:true,
            nest:true
        })
        if(!user){
            return res.status(400).json({
                status:400,
                message: "Account is not registered."
            });
        }

    
        const validPass  = await Helper.passwordHelper.match(password, user.password);
        if(!validPass){
            return res.status(400).json({
                status:400,
                message: "You have entered an invalid username or password"
            });
        }
        

        const token = middleware.sign({
            id:user.id,
            name:user.name,
            email: user.email
        });
        // user.$has('role').then(role => console.log(role));
        res.json({
            status: 200,
            message : "You are successfully logged in",
            data : { 
                token,
                user: {
                    id: user.id,
                    name : user.name,
                    username : user.name,
                    email : user.email
                }
            }
        })
    }
    
    @Post('/signup', {validator:['email', 'password', 'name']})
    async signUp(req:Request, res:Response){

        const data = req.body;
        const checkEmail = await UserModel.findOne({where:{email:data.email}, raw:true});
        if(checkEmail){
            return res.status(400).json({status:400, message:"The email address is already in use. Please use a different email address"});
        }
        const hashPassword = await Helper.passwordHelper.create(data.password); 
        const user = await UserModel.create({
            name:data.name,
            email : data.email,
            username: data.username,
            password:hashPassword,
            createdAt:db.Sequelize.literal("(CURRENT_DATE())")
        })
        await user.save();
        if(user.id){

            res.json({
                status : 200,
                message : "User Successfully created",
                data : user,
            });
        }
        return res.status(400).json({status:400, message:"Oops something has error, please try again."});
        
    }

    @Get('/me')
    async me(req:JWTRequest, res:Response){
        const id = req.auth?.id
        const user = await UserModel.findByPk(id, {raw:true});
    
        res.json({
            status: 200,
            message: "User detail",
            data : { 
                id: user?.id,
                name: user?.name,
                email : user?.email,
                createdAt : user?.createdAt
            }
        });
        
    }
}