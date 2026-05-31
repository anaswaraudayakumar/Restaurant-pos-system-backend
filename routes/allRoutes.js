const express = require('express')
const userController = require("../controllers/userController")
const orderController = require('../controllers/orderController')
const tableController = require('../controllers/tableController')
const authMiddleware = require('../middleware/authMiddleware')
const paymentController = require('../controllers/paymentController')
// to set up routes outside express server, create object for Router class of express
const router = new express.Router()

//register 
router.post('/register',userController.registerController)
//login
router.post('/login', userController.loginController)
//get single
router.get("/user/profile",authMiddleware,userController.getUserController)
//logout
router.post("/logout",userController.logOutController)
// ------------------------------------------------------------------------------------------------------------//

//order
//add order
router.post("/add-order",authMiddleware,orderController.addOrderController)
//all-order
router.get("/all-order",authMiddleware,orderController.getAllOrderController)
//one-order
router.get("/one-order/:id",authMiddleware,orderController.getOneOrderController)
//edit order status
router.put("/one-order/:id",authMiddleware,orderController.updateOrderController)

//router for clear all test dta order
router.delete("/clear-order",authMiddleware,orderController.clearAllOrderController)

//router for get revenue 
router.get("/revenue",authMiddleware,orderController.getRevenueController)


// -----------------------------------------------------------------------------------------------------

//table
//add table
router.post("/add-table",authMiddleware,tableController.addTableController)
//get all table
router.get("/all-table",authMiddleware,tableController.getTablesController)
//update
router.put("/edit-table/:id",authMiddleware,tableController.updateTableController)

//payment
router.post("/create-order", authMiddleware,paymentController.createOrderController)

router.post("/verify-payment",  authMiddleware,paymentController.verifyPaymentController)

module.exports = router