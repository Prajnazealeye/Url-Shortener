const router = require("express").Router()

router.use("/url", require("../routes/url.routes"))

module.exports = router