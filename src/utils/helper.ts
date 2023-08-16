import bcrypt from 'bcrypt'

const hashKey = "SEC_CLOUD";
const has = (o:any, k:any) => Object.prototype.hasOwnProperty.call(o, k);



class Helper{
    static mergeDefault(def:any, given:any) {
        if (!given) return def;
        for (const key in def) {
            if (!has(given, key) || given[key] === undefined) {
                given[key] = def[key];
            } else if (given[key] === Object(given[key])) {
                given[key] = Helper.mergeDefault(def[key], given[key]);
            }
        }

        return given;
    }


    static passwordHelper = {
        create : (password:string) => {
            return new Promise<string>((resolve, reject) => {
                bcrypt.hash(password, 10, function(err, hash) {
                    if(err) reject(err);
                    resolve(hash);
                });
            })
        },
    
       match : async (password:string, hash:string) => {
           const isMatch = await bcrypt.compare(password, hash);
           if(isMatch){ return true; }
           return false;
        }
    }
    
   
}


export { Helper }