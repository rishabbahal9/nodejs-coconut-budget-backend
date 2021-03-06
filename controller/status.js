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
                homeRent: statusArr.find(status=>{return status._id.transactionType==='House rent'}),
                phone: statusArr.find(status=>{return status._id.transactionType==='Phone'}),
                fuel: statusArr.find(status=>{return status._id.transactionType==='Fuel'}),
                grocery: statusArr.find(status=>{return status._id.transactionType==='Grocery'}),
                myGrocery: statusArr.find(status=>{return status._id.transactionType==='MyGrocery'}),
                others: statusArr.find(status=>{return status._id.transactionType==='Others'}),
                income: statusArr.find(status=>{return status._id.transactionType==='Income'})
            }
            Transaction.aggregate([
                {$match: {date: {$gte:new Date(currentYear,currentMonth,01),$lte:new Date(currentYear,currentMonth,currentDate,23,59)}}},
                {$group: {_id: {earned:"$earned"},amount:{$sum:"$amount"}}}
            ])
            .then(status2Arr=>{
                status2Obj={
                    earned: status2Arr.find(status=>{return status._id.earned==='earned'}),
                    spent: status2Arr.find(status=>{return status._id.earned==='spent'}),
                    saved: {amount: status2Arr.find(status=>{return status._id.earned==='earned'}).amount-status2Arr.find(status=>{return status._id.earned==='spent'}).amount},
                }   
                Transaction.aggregate([
                    {$match: {date: {$gte:new Date(currentYear,currentMonth,01),$lte:new Date(currentYear,currentMonth,currentDate,23,59)}}},
                    {$group: {_id: {paymentMethod:"$paymentMethod"},amount:{$sum:"$amount"}}}
                ])
                .then(status3Arr=>{
                    status3Obj={
                        cibcDebitCard: status3Arr.find(status=>{return status._id.paymentMethod==='CIBC debit card'}),
                        cibcCreditCard: status3Arr.find(status=>{return status._id.paymentMethod==='CIBC credit card'}),
                        cash: status3Arr.find(status=>{return status._id.paymentMethod==='Cash'}),
                        forexCard: status3Arr.find(status=>{return status._id.paymentMethod==='Forex card'}),
                        interactETransfer: status3Arr.find(status=>{return status._id.paymentMethod==='Interact e transfer'}),
                        nA: status3Arr.find(status=>{return status._id.paymentMethod==='Not applicable'}),
                    }
                    res.status(200).json({status: statusObj,status2: status2Obj,status3: status3Obj})
                })
                .catch(err=>{
                    console.log(err)
                })
            })
            .catch(err=>{
                console.log(err)
            })
        }
    )
    .catch(err=>{
        console.log(err)
    })
}