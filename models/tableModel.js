const mongoose = require('mongoose')

const tableSchema = new mongoose.Schema({
    tableNo: {
        type:Number,
        required:true,
        unique:true
    },
    status:{
        type:String,
        enum: ["Available", "Booked"],
        default:"Available"
    },
    seats:{
        type: Number,
        required:true
    },
    currentOrder:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"orders"
    }
})
const tables = mongoose.model("tables", tableSchema)
module.exports = tables