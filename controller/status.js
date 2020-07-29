const Transaction = require("../models/transaction")

exports.getStatus=(req,res,next)=>{
    dateNow=new Date()
    currentYear=dateNow.getFullYear()
    currentMonth=dateNow.getMonth()
    currentDate=dateNow.getDate()
    Transaction.aggregate([
        {$match: {date: {$gte:new Date(currentYear,currentMonth,01),$lte:new Date(currentYear,currentMonth,currentDate,23,59)}}},
        {$group: {_id: {transactionType:"$transactionType"},amount:{$sum:"$amount"}}}
    ])
    .then(
        statusArr=>{
            console.log("Status:")
            console.log(statusArr)
            statusObj={
                homeRent: statusArr.find(status=>{return status._id.transactionType==='House rent'}).amount,
                phone: statusArr.find(status=>{return status._id.transactionType==='Phone'}).amount,
                fuel: statusArr.find(status=>{return status._id.transactionType==='Fuel'}).amount,
                grocery: statusArr.find(status=>{return status._id.transactionType==='Grocery'}).amount,
                myGrocery: statusArr.find(status=>{return status._id.transactionType==='MyGrocery'}).amount,
                others: statusArr.find(status=>{return status._id.transactionType==='Others'}).amount,
                income: statusArr.find(status=>{return status._id.transactionType==='Income'}).amount
            }
            res.status(200).json({status: statusObj})   
        }
    )
    .catch(err=>{
        console.log(err)
    })
}