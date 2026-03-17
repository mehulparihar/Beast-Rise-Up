import React, { useEffect, useState } from 'react'
import { Truck, Clock, Package } from "lucide-react"
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

const ShippingPolicyPage = () => {
   
   const shippingMethods = [
    {
      icon: Truck,
      name: "Standard Shipping",
      time: "5-7 Business Days",
      price: "₹99",
      freeAbove: "Free above ₹999",
    },
    {
      icon: Clock,
      name: "Express Shipping",
      time: "2-3 Business Days",
      price: "₹199",
      freeAbove: "Free above ₹2499",
    },
    {
      icon: Package,
      name: "Next Day Delivery",
      time: "1 Business Day",
      price: "₹349",
      freeAbove: "Select cities only",
    },
  ]

  return (
    <>
      <Navbar  />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4">Shipping Policy</h1>
          <p className="text-muted-foreground mb-12">Last updated: January 1, 2025</p>

          {/* Shipping Methods Cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {shippingMethods.map((method) => {
              const Icon = method.icon
              return (
                <div key={method.name} className="bg-secondary rounded-2xl p-6">
                  <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center mb-4">
                    <Icon className="text-background" size={24} />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{method.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{method.time}</p>
                  <p className="text-lg font-bold text-foreground">{method.price}</p>
                  <p className="text-xs text-accent font-medium">{method.freeAbove}</p>
                </div>
              )
            })}
          </div>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Processing Time</h2>
              <p className="text-muted-foreground leading-relaxed">
                All orders are processed within 1-2 business days (excluding weekends and holidays). Orders placed after
                2:00 PM IST will be processed the next business day. You will receive a confirmation email with tracking
                information once your order has shipped.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Domestic Shipping (India)</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We deliver to all pin codes across India. Delivery times may vary based on location:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>Metro Cities:</strong> 2-4 business days
                </li>
                <li>
                  <strong>Tier 2 Cities:</strong> 4-6 business days
                </li>
                <li>
                  <strong>Other Locations:</strong> 5-8 business days
                </li>
                <li>
                  <strong>Remote Areas:</strong> 7-10 business days
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Free Shipping</h2>
              <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 mb-4">
                <p className="text-foreground font-semibold">
                  🎉 Enjoy FREE Standard Shipping on all orders above ₹999!
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Use code <span className="font-bold text-foreground">BEAST20</span> at checkout to get free shipping on
                orders above ₹499 (limited time offer).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Order Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                Once your order is shipped, you will receive an email and SMS with your tracking number. You can track
                your order by:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                <li>Clicking the tracking link in your shipping confirmation email</li>
                <li>Logging into your account and viewing &quot;My Orders&quot;</li>
                <li>Contacting our customer support team</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Shipping Partners</h2>
              <p className="text-muted-foreground leading-relaxed">
                We partner with trusted logistics providers including Delhivery, BlueDart, DTDC, and India Post to
                ensure safe and timely delivery of your orders.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Delivery Issues</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you experience any issues with your delivery:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>Package not received:</strong> If your tracking shows delivered but you haven&apos;t received
                  it, contact us within 48 hours
                </li>
                <li>
                  <strong>Damaged package:</strong> Refuse delivery and contact us immediately with photos
                </li>
                <li>
                  <strong>Wrong address:</strong> Contact us immediately to update shipping address before dispatch
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">International Shipping</h2>
              <p className="text-muted-foreground leading-relaxed">
                Currently, we only ship within India. International shipping is coming soon! Subscribe to our newsletter
                to be notified when we expand our shipping destinations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                For shipping inquiries, please contact us at{" "}
                <a href="mailto:shipping@beastriseup.com" className="text-accent hover:underline">
                  shipping@beastriseup.com
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

export default ShippingPolicyPage