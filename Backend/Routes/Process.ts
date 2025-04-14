import  express  from "express";
const router=express.Router()
import { upload } from "../Controllerse/Multer.js";
import { Process, FetchData,ProcessData} from "../Controllerse/UserController.js";
router.post("/ProcessFile",upload.single('file'),Process)
router.get('/GetData',FetchData)
router.get('/Aggregate',ProcessData)
export default router