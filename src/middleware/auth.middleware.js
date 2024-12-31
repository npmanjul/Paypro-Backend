import jwt from 'jsonwebtoken';
import userModel from '../model/user.model.js';

const authMiddleware = async (req, res, next) => {
    try{
        const  token=req.header('Authorization');
        if(!token){
            return res.status(401).send({ msg: "Unauthorized HTTP, Token not provided" });
        }

        const jwtToken=token.replace('Bearer ','').trim();
        
        const isVerified=jwt.verify(jwtToken,process.env.JWT_SECRET_TOKEN);
        if(!isVerified){
            return res.status(401).send({ message: "Unauthorized HTTP, Token is invalid" });
        }
        
        const userData=await userModel.findOne({email:isVerified.email}).select({
            password:0,
        });    

        req.user=userData;
        req.token=token;
        req.userId=userData._id;
        next();
    }catch(error){
        res.status(401).send({ message: "something went to wrong" });
    }
}

export default authMiddleware;