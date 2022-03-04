const auth = require('../middleware/auth')
const uploadCtrl = require('../controller/uploadCtrl')
const router = require('express').Router()

router.post('/upload',uploadCtrl.fileStore)
router.post('/download',uploadCtrl.fileDown)

module.exports = router