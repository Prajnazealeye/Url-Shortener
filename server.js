require("dotenv").config();
require("./config/dbConnection").connectToPostgres();
require("./models/index");
const app = require("./app");
const { getLinkWithShortUrl } = require("./controllers/url.controller");

app.get("/r/:URLCode", getLinkWithShortUrl);

app.use("/api/v1/", require("./routes/index"));

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`app running at port ${process.env.PORT}`);
});
