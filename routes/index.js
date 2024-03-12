const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("This API is running :)");
});

module.exports = router;
