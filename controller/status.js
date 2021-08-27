const Transaction = require("../models/transaction")
const lastDayOfMonth = (y,m)=>{
    return  new Date(y, m +1, 0).getDate();
}
exports.getStatus=(req,res,next)=>{
    console.log('req.params.dateObj')
    console.log(req.params.dateObj)
    dateNow=new Date(req.params.dateObj*1)
    currentYear=dateNow.getFullYear()
    currentMonth=dateNow.getMonth()
    currentDate=dateNow.getDate()
    Transaction.aggregate([
        {$match: {date: {$gte:new Date(currentYear,currentMonth,01),$lte:new Date(currentYear,currentMonth,lastDayOfMonth(currentYear,currentMonth),23,59)}}},
        {$group: {_id: {transactionType:"$transactionType"},amount:{$sum:"$amount"}}}
    ])
    .then(
        statusArr=>{
            console.log("Status:")
            console.log(statusArr)
            statusObj={
                homeRent: statusArr.find(status=>{return status._id.transactionType==='House rent'}),
                phone: statusArr.find(status=>{return status._id.transactionType==='Phone'}),
                internet: statusArr.find(status=>{return status._id.transactionType==='Internet'}),
                fuel: statusArr.find(status=>{return status._id.transactionType==='Fuel'}),
                grocery: statusArr.find(status=>{return status._id.transactionType==='Grocery'}),
                myGrocery: statusArr.find(status=>{return status._id.transactionType==='MyGrocery'}),
                others: statusArr.find(status=>{return status._id.transactionType==='Others'}),
                income: statusArr.find(status=>{return status._id.transactionType==='Income'})
            }
            Transaction.aggregate([
                {$match: {date: {$gte:new Date(currentYear,currentMonth,01),$lte:new Date(currentYear,currentMonth,lastDayOfMonth(currentYear,currentMonth),23,59)}}},
                {$group: {_id: {earned:"$earned"},amount:{$sum:"$amount"}}}
            ])
            .then(status2Arr=>{
                const q1=status2Arr.find(status=>{return status._id.earned==='earned'});
                const q2=status2Arr.find(status=>{return status._id.earned==='spent'});
                const a=q1?q1.amount:0;
                const b=q2?q2.amount:0;

                status2Obj={
                    earned: status2Arr.find(status=>{return status._id.earned==='earned'}),
                    spent: status2Arr.find(status=>{return status._id.earned==='spent'}),
                    saved: {amount: a-b},
                }   
                Transaction.aggregate([
                    {$match: {date: {$gte:new Date(currentYear,currentMonth,01),$lte:new Date(currentYear,currentMonth,lastDayOfMonth(currentYear,currentMonth),23,59)}}},
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