const jwt = require('jsonwebtoken')

const auth = (req,res,next)=>{
    try {
        const token = req.header('Authorization')
        if(!token) return res.status(400).json({msg:"Invalid Auth"})
        jwt.verify(token,process.env.ACCESS_TOKEN,(err,user)=>{
            if(err) return res.status(400).json({mgs:"Invalid Auth"})
            req.user = user
            next()
        })
    } catch (error) {
        
    }
}



module.exports = auth