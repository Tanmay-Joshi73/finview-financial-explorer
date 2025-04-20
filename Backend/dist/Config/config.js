"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeminiModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Connect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect("mongodb+srv://tanmayjoshi072:rhxWULugASq8WSkg@cluster0.wcwa8f5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {});
    }
    catch (err) {
        console.log(err);
    }
});
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GeminiApiKey);
const getGeminiModel = () => {
    return genAI.getGenerativeModel({
        model: "gemini-pro",
        generationConfig: {
            maxOutputTokens: 2000,
            temperature: 0.7
        }
    });
};
exports.getGeminiModel = getGeminiModel;
exports.default = Connect;
