const router = require("express").Router();

router.use("/url", require("./url.routes"));

// router.get("/r/:id",(req,res)=>{
// return res.redirect()})

module.exports = router;
