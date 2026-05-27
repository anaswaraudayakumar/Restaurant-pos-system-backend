const express = require('express')
const userController = require("../controllers/userController")
const orderController = require('../controllers/orderController')
const tableController = require('../controllers/tableController')
const authMiddleware = require('../middleware/authMiddleware')
// to set up routes outside express server, create object for Router class of express
const router = new express.Router()

//register 
router.post('/register',userController.registerController)
//login
router.post('/login', userController.loginController)
//get single
router.get("/user/:id",authMiddleware,userController.getUserController)
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
// -----------------------------------------------------------------------------------------------------

//table
//add table
router.post("/add-table/:id",authMiddleware,tableController.addTableController)
//get all table
router.get("/all-table",authMiddleware,tableController.getTablesController)
//update
router.put("/edit-table/:id",authMiddleware,tableController.updateTableController)



module.exports = router