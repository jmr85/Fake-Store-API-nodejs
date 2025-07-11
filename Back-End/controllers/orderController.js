const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/APIError");

const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const Cart = require("../models/cartSchema");
const Order = require("../models/orderSchema");

// @desc    create cash order
// @route   POST /api/v1/orders/cartId
// @access  Protected/User
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cardId);

  if (!cart) {
    return next(
      new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
    );
  }

  // 2) Get order price depend on cart price "Check if coupon apply"
  // const cartPrice = cart.totalPriceAfterDiscount
  //   ? cart.totalPriceAfterDiscount
  //   : cart.totalCartPrice;

  // const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  let cartPrice = (cart.totalPriceAfterDiscount !== undefined && cart.totalPriceAfterDiscount !== null)
  ? cart.totalPriceAfterDiscount
  : cart.totalCartPrice;

  if (!cartPrice || Number.isNaN(cartPrice)) {
    cartPrice = Array.isArray(cart.cartItems)
      ? cart.cartItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0)
      : 0;
  }
  const totalOrderPrice = Number(cartPrice) + Number(taxPrice) + Number(shippingPrice);


  console.log('cart.totalPriceAfterDiscount:', cart.totalPriceAfterDiscount);
  console.log('cart.totalCartPrice:', cart.totalCartPrice);
  console.log('cart.cartItems:', cart.cartItems);


  // 3) Create order with default paymentMethodType cash

  const order = await Order.create({
    user: req.Profile._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ status: "success", data: order });
});
