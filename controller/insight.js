const Transaction = require("../models/transaction");

const getMonthlyIncomeExpense = (year,month) => {
  return Transaction.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(year, month, 01),
          $lte: new Date(
            year,
            month,
            lastDayOfMonth(year, month),
            23,
            59
          ),
        },
      },
    },
    { $group: { _id: { earned: "$earned" }, amount: { $sum: "$amount" } } },
  ])
};
const lastDayOfMonth = (y, m) => {
  return new Date(y, m + 1, 0).getDate();
};
exports.netIncome = async (req, res, next) => {
  

  const currentMonth = new Date().getMonth(); // Months are from 0 to 11
  const currentYear = new Date().getFullYear(); // Months are from 0 to 11
  
  for (let month = 0; month < currentMonth; month++) {
    const d=await getMonthlyIncomeExpense(currentYear, month)
    console.log(d);
  }
  
};
