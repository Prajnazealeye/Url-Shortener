const router = require("express").Router();
const { createUrl, getLinkWithShortUrl } = require("../controllers/url.controller");

router.post("/create", createUrl);
router.get("/:URLCode", getLinkWithShortUrl);

module.exports = router;
