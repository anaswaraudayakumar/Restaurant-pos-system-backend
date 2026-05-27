const jwt = require('jsonwebtoken')

const authMiddleware = (req,res,next)=>{
    console.log('Inside Authonication middleware');
    const token = req.cookies.token
    console.log(token)
    if(!token){
        return res.status(401).json({
            message:"Please login first"
        })
        }
    try{
        const jwtResponse = jwt.verify(
            token,
            process.env.JWT_SECRET
        )
        console.log(jwtResponse);
        req.user = jwtResponse
        next()
        
    } catch (err) {

        res.status(401).json({
            message: "Invalid token"
        })
    }   
        
    
}

module.exports = authMiddleware