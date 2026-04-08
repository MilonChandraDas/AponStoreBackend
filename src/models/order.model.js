const mongoose = require("mongoose");

// TODO: this section has some issues, fix in future

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cart",
      required: true,
    }
  },
  {
    timestamps: true,
  },
);

const orderModel = mongoose.model("order", orderSchema);

module.exports = orderModel;
