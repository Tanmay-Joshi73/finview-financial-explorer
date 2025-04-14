import mongoose, { Schema, Document } from "mongoose";

// 1. Define TypeScript interfaces for type safety
interface IPaymentRecipient {
  name: string;
  time: string;
  Amount: string;
  Weekend: boolean;
}

interface ITransaction extends Document {
  month: string;
  Date: Date;
  Paid_To_Who: IPaymentRecipient;
}

// 2. Enhanced Schema definition
const Transactions_Schema = new Schema<ITransaction>({
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
        validator: (v: string) => /^\d+$/.test(v), // Ensures only digits
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
const Transactions_Collection = mongoose.model<ITransaction>(
  'Transactions_Collection', 
  Transactions_Schema
);

export default Transactions_Collection;