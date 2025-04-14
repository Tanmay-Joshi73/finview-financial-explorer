"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// 2. Enhanced Schema definition
const Transactions_Schema = new mongoose_1.Schema({
    month: {
        type: String,
        required: true,
        enum: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        // uppercase: true // Ensures consistent casing
    },
    Date: {
        type: Date,
        required: true,
        index: true // Add index for better query performance
    },
    Paid_To_Who: {
        name: {
            type: String,
            required: true,
            trim: true // Automatically removes whitespace
        },
        time: {
            type: String,
            required: true,
            match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/ // Validates time format
        },
        Amount: {
            type: String,
            required: true,
            validate: {
                validator: (v) => /^\d+$/.test(v), // Ensures only digits
                message: props => `${props.value} is not a valid amount!`
            }
        },
        Weekend: {
            type: Boolean,
            required: true,
            default: false
        }
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});
// 3. Fix the model name typo and add indexes
Transactions_Schema.index({ month: 1, Date: 1 }); // Compound index
// 4. Corrected model name (removed duplicate "Tran")
const Transactions_Collection = mongoose_1.default.model('Transactions_Collection', Transactions_Schema);
exports.default = Transactions_Collection;
