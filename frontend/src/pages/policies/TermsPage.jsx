import React, { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'

const TermsPage = () => {
    
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-12">Last updated: January 1, 2025</p>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using the Beast Rise Up website and services, you accept and agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Use of Service</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree to use our website only for lawful purposes and in accordance with these Terms. You agree not
                to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Violate any laws in your jurisdiction</li>
                <li>Submit false or misleading information</li>
                <li>Interfere with the proper working of the service</li>
                <li>Attempt to gain unauthorized access to any portion of the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Account Registration</h2>
              <p className="text-muted-foreground leading-relaxed">
                When you create an account, you must provide accurate and complete information. You are responsible for
                maintaining the confidentiality of your account credentials and for all activities that occur under your
                account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Products and Pricing</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify prices at any time without prior notice. All prices are displayed in INR
                unless otherwise specified. We make every effort to display accurate product information, but we do not
                warrant that product descriptions or prices are error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Orders and Payment</h2>
              <p className="text-muted-foreground leading-relaxed">
                All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any
                order for any reason. Payment must be made through our approved payment processors (Razorpay). By
                placing an order, you authorize us to charge your payment method for the total order amount.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content on this website, including text, graphics, logos, images, and software, is the property of
                Beast Rise Up and is protected by intellectual property laws. You may not reproduce, distribute, or
                create derivative works without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                Beast Rise Up shall not be liable for any indirect, incidental, special, consequential, or punitive
                damages resulting from your use of or inability to use the service. Our total liability shall not exceed
                the amount you paid for the products giving rise to the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon
                posting on the website. Your continued use of the service after any changes constitutes acceptance of
                the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms of Service, please contact us at{" "}
                <a href="mailto:legal@beastriseup.com" className="text-accent hover:underline">
                  legal@beastriseup.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default TermsPage