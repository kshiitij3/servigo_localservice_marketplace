import Razorpay from "razorpay";

/*
  Lazy Razorpay instance — only created when first used.
  This prevents the server from crashing at startup if
  RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not yet set.
*/

let _razorpay = null;

const getRazorpay = () => {
  if (!_razorpay) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error(
        "Razorpay credentials are not configured. " +
        "Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file."
      );
    }
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return _razorpay;
};

// Proxy so existing code can keep using `razorpay.orders.create(...)` etc.
const razorpay = new Proxy(
  {},
  {
    get(_, prop) {
      return getRazorpay()[prop];
    },
  }
);

export default razorpay;