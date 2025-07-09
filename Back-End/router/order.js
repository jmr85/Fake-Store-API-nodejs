const express = require("express");

const router = express.Router();

// const {} = require("../utils/validators/BrandValidators");

const { createCashOrder } = require("../controllers/orderController");

const { requireLogIn, isAuth } = require("../middlewares/auth");
const { userById } = require("../middlewares/user");

// Create
router.post("/:cardId/:userId", [requireLogIn, isAuth], createCashOrder);

router.param("userId", userById);

module.exports = router;
