const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image/')){
        cb(null, true)
    }else{
        cb(new Error('Only images are allowed'), false)
    }
}
const upload = multer({
    storage,
    fileFilter,
    limits: {fileSize: 5 * 1024 *1024}
})



module.exports = {upload}