import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const walletSchema = new Schema({
    balance: {
        type: Number,
        default: 0
    },
    transaction: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    pin: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

walletSchema.pre('save', async function(next) {
    if (!this.isModified('pin') || this.pin === '') {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.pin = await bcrypt.hash(this.pin, salt);
        next();
    } catch (error) {
        next(error);
    }
});

walletSchema.methods.isPinCorrect = async function(pin) {
    try {
        return await bcrypt.compare(pin, this.pin);
    } catch (error) {
        throw new Error('Error while comparing pin');
    }
}

export default mongoose.model('Wallet', walletSchema);