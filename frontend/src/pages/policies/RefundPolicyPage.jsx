import React, { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

const RefundPolicyPage = () => {
    
   return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4">Refund Policy</h1>
          <p className="text-muted-foreground mb-12">Last updated: January 1, 2025</p>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Returns</h2>
              <p className="text-muted-foreground leading-relaxed">
                We want you to be completely satisfied with your purchase. If you&apos;re not happy with your order, you
                may return it within 30 days of delivery for a full refund or exchange.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Eligibility for Returns</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">To be eligible for a return, items must be:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Unworn, unwashed, and in original condition</li>
                <li>With all original tags attached</li>
                <li>In original packaging</li>
                <li>Returned within 30 days of delivery</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Non-Returnable Items</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The following items cannot be returned or exchanged:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Items marked as &quot;Final Sale&quot;</li>
                <li>Underwear and innerwear (for hygiene reasons)</li>
                <li>Customized or personalized items</li>
                <li>Items purchased during clearance sales</li>
                <li>Gift cards</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">How to Initiate a Return</h2>
              <div className="bg-secondary rounded-2xl p-6 mb-4">
                <ol className="list-decimal pl-6 space-y-3 text-muted-foreground">
                  <li>Log in to your account and go to &quot;My Orders&quot;</li>
                  <li>Select the order containing the item(s) you wish to return</li>
                  <li>Click &quot;Request Return&quot; and select the reason</li>
                  <li>Print the prepaid return label</li>
                  <li>Pack the item(s) securely and ship</li>
                </ol>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Alternatively, you can email us at{" "}
                <a href="mailto:returns@beastriseup.com" className="text-accent hover:underline">
                  returns@beastriseup.com
                </a>{" "}
                with your order number and reason for return.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Refund Processing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Once we receive your returned item, we will inspect it and notify you of the status of your refund.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Refunds are processed within 5-7 business days after inspection</li>
                <li>Refunds are credited to the original payment method</li>
                <li>Original shipping charges are non-refundable (unless the return is due to our error)</li>
                <li>You will receive an email confirmation once the refund is processed</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Exchanges</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you would like to exchange an item for a different size or color, please initiate a return and place
                a new order for the desired item. This ensures faster processing and guarantees availability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Damaged or Defective Items</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you receive a damaged or defective item, please contact us within 48 hours of delivery at{" "}
                <a href="mailto:support@beastriseup.com" className="text-accent hover:underline">
                  support@beastriseup.com
                </a>{" "}
                with photos of the damage. We will arrange a free return and send you a replacement or full refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                For any questions about returns or refunds, please contact our customer service team at{" "}
                <a href="mailto:returns@beastriseup.com" className="text-accent hover:underline">
                  returns@beastriseup.com
                </a>{" "}
                or call us at +91 1800-XXX-XXXX.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default RefundPolicyPage