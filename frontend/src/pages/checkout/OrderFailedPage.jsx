"use client"

import { motion } from "framer-motion"
import { XCircle, Flame, RefreshCcw, MessageCircle, ArrowLeft } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"
import Footer from "../../components/layout/Footer"

const OrderFailedPage = () => {
    const [searchParams] = useSearchParams()
    const errorCode = searchParams.get("error") || "PAYMENT_FAILED"

    const errorMessages = {
        PAYMENT_FAILED: {
            title: "Payment Failed",
            description: "Your payment could not be processed. Please try again or use a different payment method.",
        },
        CARD_DECLINED: {
            title: "Card Declined",
            description: "Your card was declined. Please check your card details or contact your bank.",
        },
        NETWORK_ERROR: {
            title: "Connection Error",
            description: "We couldn't connect to the payment gateway. Please check your internet and try again.",
        },
        TIMEOUT: {
            title: "Request Timeout",
            description: "The payment request timed out. Your card was not charged. Please try again.",
        },
    }

    const error = errorMessages[errorCode] || errorMessages.PAYMENT_FAILED

    return (
        <div className="min-h-screen bg-secondary flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
            >
                {/* Failed Card */}
                <div className="bg-background rounded-3xl p-8 sm:p-10 shadow-xl text-center">
                    {/* Error Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <XCircle className="text-red-600" size={40} />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-2">{error.title}</h1>
                        <p className="text-muted-foreground mb-8">{error.description}</p>
                    </motion.div>

                    {/* Error Code */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-secondary rounded-2xl p-4 mb-8"
                    >
                        <span className="text-sm text-muted-foreground">Error Code: </span>
                        <span className="font-mono font-bold text-foreground">{errorCode}</span>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-3"
                    >
                        <Link
                            href="/checkout"
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-foreground text-background font-bold rounded-xl hover:bg-foreground/90 transition-colors"
                        >
                            <RefreshCcw size={18} />
                            Try Again
                        </Link>
                        <Link
                            href="/"
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-secondary text-foreground font-semibold rounded-xl hover:bg-secondary/80 transition-colors"
                        >
                            <ArrowLeft size={18} />
                            Back to Shop
                        </Link>
                        <button className="w-full flex items-center justify-center gap-2 px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors">
                            <MessageCircle size={18} />
                            Contact Support
                        </button>
                    </motion.div>
                </div>

                {/* Footer */}
                <Footer />
            </motion.div>
        </div>
    )
}

export default OrderFailedPage