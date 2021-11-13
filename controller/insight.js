const Transaction = require("../models/transaction");

exports.netIncome = (req, res, next) => {
  const currentMonth = new Date().getMonth(); // Months are from 0 to 11
  for (let month = 0; month <= currentMonth; month++) {
      // Call a method which returns month's total expenses and income
  }
  const incomeData = [
    4000, 4500, 3200, 5000, 2300, 7000, 4000, 5000, 6400, 7200,
  ];
  const expenseData = [
    1250, 2000, 800, 1500, 1300, 2300, 900, 1023, 3002, 2330,
  ];
  const netIncomeData = [];
  for (let x = 0; x < incomeData.length; x++) {
    netIncomeData[x] = incomeData[x] - expenseData[x];
  }
  return res.status(200).json({
    incomeData: incomeData,
    expenseData: expenseData,
    netIncomeData: netIncomeData,
  });
};
