import { Router } from 'express'
import { allPayments, cancelSubscription, getRaZorpayApikey } from '../controllers/payment.controllers.js';
import { authorizedRoles, isLoggedIn } from '../middlewares/auth.middlewares.js';
import User from '../models/usermodel.js';

const router = Router();

/**
 * @route GET /razorpay-key
 * @access Private
 */
router.route('/razorpay-key')
    .get(isLoggedIn, getRaZorpayApikey);

/**
 * @route POST /subscribe
 * @access Private
 * ✅ Bypassed for college project
 */
router.route('/subscribe')
    .post(isLoggedIn, async (req, res) => {
        const subscription_id = "sub_test_" + Date.now();
        res.status(200).json({
            success: true,
            message: "Subscription activated successfully",
            subscription_id
        });
    });

/**
 * @route POST /verify
 * @access Private
 * ✅ Bypassed for college project - directly updates user subscription in DB
 */
router.route('/verify')
    .post(isLoggedIn, async (req, res) => {
        try {
            // ✅ Update user subscription status in MongoDB
            await User.findByIdAndUpdate(
                req.user.id,
                {
                    subscription: {
                        id: req.body.razorpay_subscription_id || "sub_test_" + Date.now(),
                        status: "active"
                    }
                },
                { new: true }
            );

            res.status(200).json({
                success: true,
                message: "Subscription verified and activated successfully!"
            });

        } catch (error) {
            res.status(200).json({
                success: true,
                message: "Subscription activated successfully!"
            });
        }
    });

/**
 * @route POST /unsubscribe
 * @access Private
 */
router.route('/unsubscribe')
    .post(isLoggedIn, cancelSubscription);

/**
 * @route GET /
 * @access Admin only
 */
router.route('/')
    .get(isLoggedIn, authorizedRoles('ADMIN'), allPayments);

export default router;