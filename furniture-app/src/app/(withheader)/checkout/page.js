"use client";
import { clearCart } from "@/redux/cartSlice";
import axios from "axios";
// DELETE THIS LINE: import iziToast from "izitoast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import {
  MdAdd,
  MdDeleteOutline,
  MdOutlineKeyboardArrowRight,
  MdRemove,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import 'izitoast/dist/css/iziToast.min.css';

// Keep this part! It safely loads iziToast only in the browser, preventing SSR errors.
let iziToast;
if (typeof window !== 'undefined') {
  iziToast = require('izitoast');
}

let apiBaseUrl = process.env.NEXT_PUBLIC_APIBASEURL;
export default function CheckoutPage() {
  const { error, isLoading, Razorpay } = useRazorpay();
  const router = useRouter();

  let cart = useSelector((myStore) => myStore.cartStore.cart);
  let token = useSelector((allStore) => allStore.userStore.token);
  let total = cart.reduce((acc, obj) => (acc += obj.qty * obj.productPrice), 0);
  let shipping = 150;

  let dispatch = useDispatch();

  const handleCheckoutSubmit = (event) => {
    event.preventDefault();
    let shippingAddress = {
      fullName: event.target.fullName.value,
      mobileNumber: event.target.mobileNumber.value,
      billingName: event.target.billingName.value,
      billingEmail: event.target.billingEmail.value,
      billingMobileNumber: event.target.billingMobileNumber.value,
      billingAddress: event.target.billingAddress.value,
      country: event.target.country.value,
      state: event.target.state.value,
      city: event.target.city.value,
      pincode: event.target.pincode.value,
    };
    let paymentMethod = event.target.payment.value;
    console.log(cart);
    let items = cart.map((obj) => {
      return {
        name: obj.productName,
        price: obj.productPrice,
        qty: obj.qty,
        image: obj.productImage,
      };
    });

    let orderObj = {
      shippingAddress,
      items,
      paymentMethod,
      totalAmount: total,
    };

    axios
      .post(`${apiBaseUrl}web/order/save-order`, orderObj, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data)
      .then((finalRes) => {
        if (paymentMethod == "cod") {
          if (finalRes.status) {
            iziToast.success({
              title: "success",
              message: finalRes.msg,
              position: "topRight",
            });
            dispatch(clearCart());
            event.target.reset();
            router.push("/thank-you");
          }
        } else {
          if (finalRes.status) {
            const options = {
              key: "rzp_test_TRbHzv8ucjrMyi",
              amount: finalRes.razorPayRes.amount_due, // Amount in paise
              currency: "INR",
              name: "WsCubeTech",
              description: "Test Transaction form WsCubeTech",
              order_id: finalRes.razorPayRes.id, // Generate order_id on server
              handler: (response) => {
                //After
                console.log(response);
                axios
                  .post(`${apiBaseUrl}web/order/verify-order`, response, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  })
                  .then((res) => res.data)
                  .then((finalRes) => {
                    if (finalRes.status) {
                      event.target.reset();
                      dispatch(clearCart());
                      iziToast.success({
                        title: "success",
                        message: finalRes.message,
                      });
                      router.push("/thank-you");
                    }
                  })
                  .catch((error) => {
                    console.error("Order verification failed:", error.response?.data || error);
                    iziToast.error({
                      title: "Payment verification failed",
                      message: error.response?.data?.message || "Please try again.",
                      position: "topRight",
                    });
                  });
              },
              prefill: {
                name: event.target.fullName.value,
                email: event.target.billingEmail.value,
                contact: event.target.billingMobileNumber.value,
              },
              theme: {
                color: "#F37254",
              },
            };

            const razorpayInstance = new Razorpay(options);
            razorpayInstance.open(); //Payement gatwey popup
          }
        }
      })
      .catch((error) => {
        console.error("Order submission failed:", error.response?.data || error);
        iziToast.error({
          title: "Order failed",
          message: error.response?.data?.message || "Please try again.",
        });
      });

    console.log(orderObj);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1120px]">
        <div className="grid grid-cols-1 place-items-center border-b-1 border-gray-200 px-4 py-6">
          <h2 className="font-playfair text-4xl font-semibold text-[#1f1f1f] sm:text-5xl">
            Checkout
          </h2>
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 p-3 px-6 text-sm md:space-x-2">
              <li className="font-rubik text-dark-gray">
                <Link href="/">Home</Link>
              </li>
              <li className="font-rubik text-orange-dim">
                <div className="flex items-center">
                  <MdOutlineKeyboardArrowRight className="mr-2" /> Checkout
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <form
          onSubmit={handleCheckoutSubmit}
          className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] mt-8"
        >
          <div className="space-y-6">
            <div className="rounded-sm border border-[#ebdfd1] bg-white p-6 shadow-sm">
              <h2 className="font-playfair text-2xl font-semibold text-dark-gray">
                Billing & shipping address
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-dark-gray">
                    Full name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-dim"
                    placeholder="Enter Full Name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-dark-gray">
                    Mobile number
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-dim"
                    placeholder="Enter Mobile Number"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-dark-gray">
                    Billing name
                  </label>
                  <input
                    type="text"
                    name="billingName"
                    className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-dim"
                    placeholder="Enter Billing Name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-dark-gray">
                    Billing Email
                  </label>
                  <input
                    type="email"
                    name="billingEmail"
                    className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-dim"
                    placeholder="Enter Billing Email"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-dark-gray">
                    Billing Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="billingMobileNumber"
                    className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-dim"
                    placeholder="Enter Mobile Number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-dark-gray">
                    Billing Address
                  </label>
                  <input
                    type="text"
                    name="billingAddress"
                    className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-dim"
                    placeholder="Enter Billing Address"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-dark-gray">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-dim"
                    placeholder="Enter Billing Country"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-dark-gray">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-dim"
                    placeholder="Enter Billing   State"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-dark-gray">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-dim"
                    placeholder="Enter City"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-dark-gray">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-dim"
                    placeholder="Enter Pincode"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-sm border border-[#ebdfd1] bg-white p-6 shadow-sm">
              <h2 className="font-playfair text-2xl font-semibold text-[#1f1f1f]">
                Payment method
              </h2>
              <div className="mt-5 space-y-3">
                <label className="flex items-center gap-3 rounded-sm border border-[#e5d8ca] p-3 text-sm text-[#1f1f1f]">
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked
                    value="cod"
                    className="h-4 w-4 accent-orange-dim"
                  />
                  Cash on delivery
                </label>
                <label className="flex items-center gap-3 rounded-sm border border-[#e5d8ca] p-3 text-sm text-[#1f1f1f]">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    className="h-4 w-4 accent-orange-dim"
                  />
                  Online
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-playfair text-2xl font-semibold text-dark-gray">
              Order summary
            </h2>
            <div className="mt-5 space-y-3">
              {cart.map((item, index) => (
                <div
                  key={item._id || `${item.productId}-${index}`}
                  className="flex items-center justify-between text-sm text-dark-gray"
                >
                  <span>
                    {item.productName} × {item.qty}
                  </span>
                  <span>₹{item.productPrice * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-[#f0e2d4] pt-4 text-sm text-dark-gray">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>
              <div className="flex justify-between border-t border-[#f0e2d4] pt-3 text-base font-semibold text-[#1f1f1f]">
                <span>Total</span>
                <span>Rs. {total + shipping}</span>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-2xl bg-orange-dim px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#a9724d]"
            >
              Place order
            </button>

            <Link
              href={"/cart"}
              className="mt-4 block text-center text-sm font-medium text-orange-dim hover:text-[#a9724d]"
            >
              Back to cart
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
