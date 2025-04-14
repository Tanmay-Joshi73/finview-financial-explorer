"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Process_js_1 = __importDefault(require("./Routes/Process.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_js_1 = __importDefault(require("./Config/config.js"));
const morgan_1 = __importDefault(require("morgan"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
const Start = () => {
    (0, config_js_1.default)();
    app.listen(8000, '127.0.0.1', () => {
        console.log("Hello World");
    });
};
app.use('/API', Process_js_1.default);
Start();
