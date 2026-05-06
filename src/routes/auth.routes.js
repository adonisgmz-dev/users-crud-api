const express = require("express");
const router = express.Router();
const validateSchema = require("../middlewares/validateSchema.middleware");
const { loginSchema } = require("../schemas/auth.schema");

const { loginController } = require("../controllers/auth.controller");

router.post("/login", validateSchema(loginSchema),loginController);
module.exports = router;