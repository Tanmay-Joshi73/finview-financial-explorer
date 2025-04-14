import multer, { MulterError } from "multer"
import fs from "fs"
import path from "path"
const UploadPath='../uploads'
// if(!fs.existsSync(UploadPath)){
//    fs.mkdirSync(UploadPath)
// }
const storage=multer.diskStorage({
    destination(req, file, callback) {
        callback(null,"./uploads")
    },
    filename(req,file,callback){
        
        callback(null, file.originalname )
    }

})
export const upload=multer({ storage });
