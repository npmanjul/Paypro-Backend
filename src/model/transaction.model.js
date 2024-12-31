import mongoose,{Schema} from 'mongoose';

const transactionSchema=new Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    amount:{
        type:Number,
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now()
    }
})

export default mongoose.model('Transaction',transactionSchema);