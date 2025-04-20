import  express  from "express";
const router=express.Router()
import { upload } from "../Controllerse/Multer.js";
import { Process, FetchData,ProcessData,VendorsData,GetPrediction} from "../Controllerse/UserController.js";
router.post("/ProcessFile",upload.single('file'),Process)
router.get('/GetData',FetchData)
router.get('/Aggregate-Dashboard',ProcessData)
router.get('/Aggregate-VendorsData',VendorsData)
router.get('/Overall',GetPrediction)
export default router