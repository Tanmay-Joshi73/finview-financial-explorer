"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const Multer_js_1 = require("../Controllerse/Multer.js");
const UserController_js_1 = require("../Controllerse/UserController.js");
router.post("/ProcessFile", Multer_js_1.upload.single('file'), UserController_js_1.Process);
router.get('/GetData', UserController_js_1.FetchData);
router.get('/Aggregate-Dashboard', UserController_js_1.ProcessData);
router.get('/Aggregate-VendorsData', UserController_js_1.VendorsData);
router.get('/Overall', UserController_js_1.GetPrediction);
exports.default = router;
