const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./util/swagger.json");

dotenv.config();

const transactionRoutes = require("./routes/transaction");
const statusRoutes = require("./routes/status");
const insightRoutes = require("./routes/insight");

const app = express();

//Creating middlewares
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use("/status", statusRoutes);
app.use(transactionRoutes);
app.use("/insights", insightRoutes);

mongoose
  .connect(process.env.MongoDB_Link, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT);
    console.log("Listening to port " + process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
