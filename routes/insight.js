const controller = require("../controller/insight");
const express = require("express");
const router = express.Router();

router.get("/net-income", controller.netIncome);
module.exports = router;
