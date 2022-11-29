const router = require("express").Router(),
  routes = require("./api");

router.use("/api", routes);

module.exports = router;
