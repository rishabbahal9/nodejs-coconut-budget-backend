const mongoose=require("mongoose")
const Schema=mongoose.Schema

const transactionSchema=new Schema({
    transactionId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    earned: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    store: {
        type: String,
    },
    city: {
        type: String,
    },
    billAvailable: {
        type: String,
        required: true
    },
    transactionType: {
        type: String,
        required: true
    },
    comments: {
        type: String
    },
    thingsBought: {
        type: String,
    }
})

module.exports=mongoose.model('Transaction',transactionSchema)