const Razorpay = require("razorpay")
const crypto = require("crypto")

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})


// CREATE ORDER
exports.createOrderController = async (req, res, next) => {

    console.log("Inside createOrderController")

    try {

        const { amount } = req.body

        const options = {
            amount: amount,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        }

        const order = await razorpay.orders.create(options)

        res.status(200).json({
            success: true,
            order
        })

    } catch (error) {

        next(error)

    }

}



// VERIFY PAYMENT
exports.verifyPaymentController = async (req, res, next) => {

    console.log("Inside verifyPaymentController")

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body


        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex")


        if (generated_signature !== razorpay_signature) {

            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            })

        }


        res.status(200).json({
            success: true,
            message: "Payment verified successfully"
        })

    } catch (error) {

        next(error)

    }

}