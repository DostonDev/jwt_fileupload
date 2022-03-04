const path = require('path')
const uploadCtrl = {
    fileStore: (req,res)=>{
        try {
            console.log(req.files);
            if(!req.files || Object.keys(req.files).length===0) return res.status(400).json({msg:"no file"})
            const file = req.files.file
            if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png')
            return res.status(400).json({msg:"File format is incorrect"})
            if(file.size > 1024*1024*5) return res.status(400).json({msg:"Size too large"})
            const filePath =path.resolve(__dirname ,'../image/', file.name)
            file.mv(filePath,(err)=>{
                if(err) return res.status(400).json(err)
                res.json({filePath})
            })
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    fileDown: (req,res)=>{
        try {
            const {url} = req.body
            res.download(url,(err)=>{
            if(err) return res.status(400).json(err)
            console.log(url);
        })
        } catch (error) {
            return res.status(400).json(err)
        }
        
    }
}

module.exports = uploadCtrl