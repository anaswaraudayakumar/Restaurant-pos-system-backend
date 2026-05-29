const mongoose = require("mongoose")
const orderSchema = mongoose.Schema({
    customerDetails:{
        customerName:{type:String,required:true},
        customerPhone:{type:String,required:true},
        guests:{type:Number,required:true}
    },
    orderStatus:{
        type:String,
        required:true
    },
    orderDate:{
        type:Date,
        default:Date.now()
    },
    paymentMethod:{
   type:String,
   required:true
},

    bills:{
        total:{type:Number,required:true},
        tax:{type:Number,required:true},
        totalWithTax:{type:Number,required:true}
    },
    items:[],
    table:{type: mongoose.Schema.Types.ObjectId,
        ref:"orders"
    }
},{timestamps:true})
orderSchema.index(
   { createdAt: 1 },
   { expireAfterSeconds: 86400 }
)

const orders = mongoose.model("orders",orderSchema)
module.exports = orders