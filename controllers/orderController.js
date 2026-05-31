const orders = require('../models/orderModel')
const validator = require("validator")
const revenue = require('../models/revenueModel')


//addOrder
exports.addOrderController = async (req, res) => {
   console.log("Inside addOrderController");
   const { customerDetails, orderStatus, orderDate, paymentMethod, bills, items } = req.body

   //validation
   if (
      !customerDetails || !orderStatus || !bills || !items
   ) {
      return res.status(400).json({
         message: "All fields are required"
      })
   }
   //phone validation 
   // clean phone
   const cleanPhone = String(
      customerDetails.customerPhone
   ).replace(/\D/g, "")

   // last 10 digits
   const phoneNumber = cleanPhone.slice(-10)

   // validation
   if (
      !validator.isMobilePhone(
         phoneNumber,
         "en-IN"
      )
   ) {
      return res.status(400).json({
         message: "Invalid Customer Phone Number"
      })
   }
   //create order
   try {
      const newOrder = await orders.create({
         customerDetails: {
            customerName: customerDetails.customerName,
            customerPhone: phoneNumber,
            guests: customerDetails.guests
         },
         orderStatus,
         orderDate,
         paymentMethod,
         bills: {
            total: bills.total,
            tax: bills.tax,
            totalWithTax: bills.totalWithTax
         },
         items
      })
      //for order revenue detail
      const today = newOrder.orderDate.toISOString().split("T")[0]
      console.log("Revenue update started")
      await revenue.findOneAndUpdate(
         { date: today },
         {
            $inc: {
               totalRevenue: newOrder.bills.totalWithTax,
               totalOrders: 1
            }
         },
         {
            upsert: true,
            new: true
         }

      )
       console.log("Revenue update completed")

      res.status(201).json({
         message: "Order added successfully",
         order: newOrder

      })

   } catch (error) {
      console.log(error)

      res.status(500).json({
         message: "Server Error"
      })
   }

}
//get all order
exports.getAllOrderController = async (req, res) => {
   console.log("Inside getAllOrderController");
   const allOrders = await orders.find().sort({ createdAt: -1 })
   res.status(200).json({
      message: "All Orders fetched successfully",
      orders: allOrders
   })

}
//get one order by id
exports.getOneOrderController = async (req, res) => {
   console.log("Inside getOneOrderController");
   const { id } = req.params
   const getOneOrder = await orders.findById(id)
   if (!getOneOrder) {
      return res.status(404).json({
         message: "Order not found"
      })
   }
   res.status(200).json({
      message: "get single order  successfully",
      orders: getOneOrder
   })
}
//update order by id
exports.updateOrderController = async (req, res) => {
   console.log("Inside getOneOrderController");
   const { id } = req.params
   const { orderStatus } = req.body
   const updateOrder = await orders.findByIdAndUpdate(id, { orderStatus }, { new: true })
   if (!updateOrder) {
      return res.status(404).json({
         message: "Order Not Found"
      })
   }
   res.status(200).json({
      message: "Order updated successfully",
      order: updateOrder

   })
}

exports.clearAllOrderController = async (req, res) => {
   console.log("Inside clearAllOrderController");
   try {
      await orders.deleteMany({})
      res.status(200).json({
         message: "All orders cleared succesfully"
      })
   } catch (error) {
      res.status(500).json({
         message: "Failed to clear orders",
         error: error.message
      })
   }
}

//get revenue 
exports.getRevenueController = async(req,res)=>{
   try{
      const today = new Date().toISOString().split("T")[0]
   const todayData = await revenue.findOne({date:today})
   const overallData = await revenue.aggregate([
      {
         $group :{
            _id:null,
            totalRevenue:{$sum: "$totalRevenue"},
            totalOrders:{$sum: "$totalOrders"}
         }
      }
   ])
   res.status(200).json({
      totalRevenue: todayData?.totalRevenue ||0,
      totalOrders:todayData?.totalOrders || 0,
       overallRevenue: overallData[0]?.totalRevenue || 0,
      overallOrders: overallData[0]?.totalOrders || 0
   })
}catch (error){
   res.status(500).json({
      message: error.message
    })
  }
}