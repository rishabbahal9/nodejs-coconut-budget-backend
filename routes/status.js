const controller = require("../controller/status");
const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("Status");
});
router.get("/getStatus/:dateObj", controller.getStatus);
module.exports = router;
