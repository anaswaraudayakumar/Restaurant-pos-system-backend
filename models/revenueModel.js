const mongoose = require('mongoose')

const revenueSchema = new mongoose.Schema({
    date:{
        type:String,
        required:true,
        unique:true
    },
    totalRevenue:{
        type:Number,
        default:0
    },
      totalOrders: {
      type: Number,
       default: 0
  }
})

module.exports = mongoose.model("revenues",revenueSchema)