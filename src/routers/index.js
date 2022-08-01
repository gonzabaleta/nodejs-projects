const { Router } = require("express");
const staticRouter = require("./static");
const apiRouter = require("./api");

const router = Router();

router.use("/", staticRouter);
router.use("/api", apiRouter);

module.exports = router;
