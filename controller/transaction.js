const Transaction = require("../models/transaction");

const lastDayOfMonth = (y, m) => {
  return new Date(y, m + 1, 0).getDate();
};
exports.getMonthlyTransactions = (req, res, next) => {
  dateNow = new Date(req.params.dateObj * 1);
  currentYear = dateNow.getFullYear();
  currentMonth = dateNow.getMonth();
  currentDate = dateNow.getDate();
  Transaction.find({
    date: {
      $gte: new Date(currentYear, currentMonth, 01),
      $lte: new Date(
        currentYear,
        currentMonth,
        lastDayOfMonth(currentYear, currentMonth),
        23,
        59
      ),
    },
  })
    .sort({ date: 1 })
    .then((transaction) => {
      console.log("Transaction:");
      console.log(transaction);
      res.status(200).json({ transaction: transaction });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewTransaction = (req, res, next) => {
  const transaction = new Transaction({
    transactionId: req.body.transactionId,
    date: req.body.date,
    earned: req.body.earned,
    amount: req.body.amount,
    paymentMethod: req.body.paymentMethod,
    store: req.body.store,
    city: req.body.city,
    billAvailable: req.body.billAvailable,
    transactionType: req.body.transactionType,
    comments: req.body.comments,
    thingsBought: req.body.thingsBought,
  });
  transaction
    .save()
    .then((result) => {
      if (result) res.status(200).json({ working: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err: err });
    });
};

exports.deleteTransaction = (req, res, next) => {
  Transaction.deleteOne({ transactionId: req.body.transactionId })
    .then((data) => {
      console.log(data);
      if (data) res.status(200).json({ transactionDeleted: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ transactionDeleted: false });
    });
};

exports.getTransaction = (req, res, next) => {
  Transaction.findOne({ transactionId: req.params.transactionId })
    .then((data) => {
      console.log(data);
      res.status(200).json({ transaction: data });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err: err });
    });
};

exports.updateTransaction = (req, res, next) => {
  Transaction.updateOne(
    { transactionId: req.body.transactionId },
    {
      $set: {
        date: req.body.date,
        earned: req.body.earned,
        amount: req.body.amount,
        paymentMethod: req.body.paymentMethod,
        store: req.body.store,
        city: req.body.city,
        billAvailable: req.body.billAvailable,
        transactionType: req.body.transactionType,
        comments: req.body.comments,
        thingsBought: req.body.thingsBought,
      },
    }
  )
    .then((data) => {
      if (data) res.status(200).json({ status: "Success" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: "Fail" });
    });
};
