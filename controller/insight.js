const Transaction = require("../models/transaction");

const getMonthlyIncomeExpense = (year, month) => {
  return Transaction.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(year, month, 01),
          $lte: new Date(year, month, lastDayOfMonth(year, month), 23, 59),
        },
      },
    },
    { $group: { _id: { earned: "$earned" }, amount: { $sum: "$amount" } } },
  ]);
};
const lastDayOfMonth = (y, m) => {
  return new Date(y, m + 1, 0).getDate();
};
exports.netIncome = async (req, res, next) => {
  const currentMonth = new Date().getMonth(); // Months are from 0 to 11
  const currentYear = new Date().getFullYear(); // Months are from 0 to 11

  // Create your own promise for the FOR loop and then return data.
  const letCalculationsBeFinished = new Promise(async (resolve, reject) => {
    const incomeDataArr = [];
    const expenseDataArr = [];
    const netIncomeDataArr = [];
    for (let month = 0; month < currentMonth; month++) {
      const data = await getMonthlyIncomeExpense(currentYear, month);
      const incomeAmount = data.find((x) => {
        return x._id.earned === "earned";
      }).amount;
      const expenseAmount = data.find((x) => {
        return x._id.earned === "spent";
      }).amount;
      incomeDataArr.push(incomeAmount);
      expenseDataArr.push(expenseAmount);
    }

    for (let i = 0; i < incomeDataArr.length; i++) {
      netIncomeDataArr[i] = incomeDataArr[i] - expenseDataArr[i];
    }
    resolve({
      incomeData: incomeDataArr,
      expenseData: expenseDataArr,
      netIncomeData: netIncomeDataArr,
    });
  });
  letCalculationsBeFinished
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
    });
};
