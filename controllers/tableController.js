const tables = require('../models/tableModel')

//add table
exports.addTableController = async (req, res) => {
    console.log("Inside addTableController");
    const { tableNo,seats } = req.body
    if (!tableNo) {
        return res.status(404).json({
            message: "Please Provide Table No..."
        })
    }
    const tablePresent = await tables.findOne({ tableNo })
    if (tablePresent) {
        return res.status(400).json({
            message: "Table already exists"
        })
    }
    // create table
    const newTable = await tables.create({
        tableNo,seats
    })
    res.status(201).json({
        message: "Table added successfully",
        table: newTable
    })

}
//getTable
exports.getTablesController = async(req,res)=>{
    console.log("Inside getTablesController");
    const allTables =await tables.find().populate({
        path:"currentOrder",
        select:"customerDetails"
    })
     res.status(200).json({
       message:"All tables got successfully",
       tables: allTables
     })
}
//updateTable
exports.updateTableController = async (req, res) => {
    const { id } = req.params
    const { status, orderId } = req.body
    const updateTable = await tables.findByIdAndUpdate( id,{status,currentOrder: orderId},
        { new: true })
    if (!updateTable) {
        return res.status(404).json({
            message: "Table not found"
        })
    }
    res.status(200).json({
        message: "Table updated successfully",
        table: updateTable
    })

}