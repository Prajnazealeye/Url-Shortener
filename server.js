const app = require("./app");
require("dotenv").config();
require("./config/dbConnection").connectToPostgres()
require("./models/index")
app.use("/api/v1/", require("./routes/index"));




app.listen(process.env.PORT, () => {
    console.log(`app running at port ${process.env.PORT}`);
  });