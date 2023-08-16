import express,{Request, Response, NextFunction} from "express";

type methods = "get" | "post" | "put" | "delete" | "patch";
type ValidatorType = string[];
interface ActionOptionType{
   validator:ValidatorType
}

let _validator = (params : ValidatorType) => (req:Request, res:Response, next:NextFunction) => {
   const reqParamList = Object.keys(req.body);
   const hasAllRequiredParams = params.filter(param =>
       !reqParamList.includes(param)
   );
   if (hasAllRequiredParams.length > 0){
      return res
          .status(400)
          .json(
              {
                 status : 400,
                 message : `Missing required parameters (${hasAllRequiredParams.join(", ")})`
              }
          );
   }
      
   next();
};

interface CtrlTypes extends ActionOptionType{
   method:methods;
   path:string;
   fn:any;
}


export function action(method:methods, path:string, opt?:ActionOptionType,{} = {}) {
   return (target:any, name:string | symbol, descriptor:PropertyDescriptor) => {
      let routes = target._routes || (target._routes = []);
      let _opt = {};
      if(opt?.validator){
         _opt = {validator:opt.validator}
      }
      routes.push( {method, path, fn: descriptor.value, ..._opt} );
   }
}

export let Get = (path:string) => action('get', path);
export let Post = (path:string, opt?:ActionOptionType) => action('post', path, opt);
export let Put = (path:string) => action('put', path);

export function routes(ctrl:any) {
   let instance = new ctrl();

   let router = express.Router();
   instance._routes.forEach( (r:CtrlTypes) => {
      return r?.validator ? router[r.method](r.path, _validator(r.validator), r.fn.bind(instance))
      : router[r.method](r.path, r.fn.bind(instance))
   });
   return router;
}