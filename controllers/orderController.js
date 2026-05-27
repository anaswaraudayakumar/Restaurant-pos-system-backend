const orders = require('../models/orderModel')
const validator = require("validator")

//addOrder
exports.addOrderController = async(req,res)=>{
    console.log("Inside addOrderController");
     const {customerDetails,orderStatus,orderDate,bills,items} = req.body

     //validation
     if(
        ! customerDetails || ! orderStatus || ! bills || !items
     ){
        return res.status(400).json({
            message:"All fields are required"
        })
     }
     //phone validation 
     if(
       !validator.isMobilePhone(
        customerDetails.customerPhone,
        "en-IN"
       )
     ){
        return res.status(400).json({
            message:"Invalid Customer Phone Number"
        })
     }
     //create order
     const newOrder = await orders.create({
        customerDetails:{
            customerName:customerDetails.customerName,
            customerPhone:customerDetails.customerPhone,
            guests:customerDetails.guests
        },
        orderStatus,
        orderDate,
        bills:{
            total:bills.total,
            tax:bills.tax,
            totalWithTax:bills.totalWithTax
        },
        items
     })
     res.status(201).json({
        message:"Order added successfully",
        order: newOrder

     })
}
//get all order
exports.getAllOrderController = async (req,res)=>{
     console.log("Inside getAllOrderController");
     const allOrders = await orders.find().sort({createdAt:-1})
     res.status(200).json({
       message:"All Orders fetched successfully",
       orders:allOrders
     })

}
//get one order by id
exports.getOneOrderController = async(req,res)=>{
     console.log("Inside getOneOrderController");
     const {id} = req.params
     const getOneOrder = await orders.findById(id)
     if (!getOneOrder) {
        return res.status(404).json({
            message: "Order not found"
        })
    }
    res.status(200).json({
       message:"get single order  successfully",
       orders:getOneOrder
     })
}
//update order by id
exports.updateOrderController = async(req,res)=>{
    console.log("Inside getOneOrderController");
    const {id} = req.params
    const {orderStatus} = req.body
    const updateOrder = await orders.findByIdAndUpdate(id,{orderStatus},{new:true})
    if(! updateOrder){
        return res.status(404).json({
            message:"Order Not Found"
        })
    }
    res.status(200).json({
        message:"Order updated successfully",
        order:updateOrder

    })
} 