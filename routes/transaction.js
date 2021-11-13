const controller = require("../controller/transaction");
const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("Home");
});
router.get(
  "/getMonthlyTransactions/:dateObj",
  controller.getMonthlyTransactions
);
router.get("/getTransaction/:transactionId", controller.getTransaction);
router.post("/postNewTransactions", controller.postNewTransaction);
router.post("/deleteTransaction", controller.deleteTransaction);
router.post("/updateTransaction", controller.updateTransaction);
module.exports = router;
