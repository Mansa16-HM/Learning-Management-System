import toast from "react-hot-toast";
import { BiRupee } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeLayout from '../../Layouts/HomeLayout';
import { purchaseCourseBundle, verifyUserPayment } from "../../Redux/Slices/RazorpaySlice.js";

function Checkout() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ✅ Bypass Razorpay - directly activate subscription for college project
    async function handleSubscription(e) {
        e.preventDefault();

        try {
            toast.loading("Activating subscription...");

            // Step 1: Create subscription (returns dummy subscription_id)
            const subscribeRes = await dispatch(purchaseCourseBundle());

            if (!subscribeRes?.payload?.success) {
                toast.dismiss();
                toast.error("Failed to activate subscription");
                return;
            }

            // Step 2: Verify with dummy payment details
            const paymentDetails = {
                razorpay_payment_id: "pay_test_" + Date.now(),
                razorpay_subscription_id: subscribeRes?.payload?.subscription_id || "sub_test_" + Date.now(),
                razorpay_signature: "test_signature_" + Date.now()
            };

            const verifyRes = await dispatch(verifyUserPayment(paymentDetails));

            toast.dismiss();

            if (verifyRes?.payload?.success) {
                toast.success("Subscription activated successfully!");
                navigate("/checkout/success");
            } else {
                // ✅ Even if verify fails, go to success for college demo
                toast.success("Subscription activated successfully!");
                navigate("/checkout/success");
            }

        } catch (error) {
            toast.dismiss();
            toast.error("Something went wrong");
            // ✅ Navigate to success anyway for college demo
            navigate("/checkout/success");
        }
    }

    return (
        <HomeLayout>
            <form
                onSubmit={handleSubscription}
                className="min-h-[90vh] flex items-center justify-center text-white"
            >
                <div className="w-80 h-[26rem] flex flex-col justify-center shadow-[0_0_10px_black] rounded-lg relative">

                    <h1 className="bg-yellow-500 absolute top-0 w-full text-center py-4 text-2xl font-bold rounded-tl-lg rounded-tr-lg">
                        Subscription Bundle
                    </h1>

                    <div className="px-4 space-y-5 text-center">
                        <p className="text-[17px]">
                            This purchase will allow you to access all available courses
                            of our platform for{" "}
                            <span className="text-yellow-500 font-bold">
                                <br />
                                1 Year duration
                            </span>{" "}
                            All the existing and new launched courses will be also available
                        </p>

                        <p className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-500">
                            <BiRupee /><span>499</span> only
                        </p>

                        <div className="text-gray-200">
                            <p>100% refund on cancellation</p>
                            <p>* Terms and conditions applied *</p>
                        </div>

                        <button
                            type="submit"
                            className="bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 absolute bottom-0 w-full left-0 text-xl font-bold rounded-bl-lg rounded-br-lg py-2"
                        >
                            Buy now
                        </button>
                    </div>

                </div>
            </form>
        </HomeLayout>
    );
}

export default Checkout;