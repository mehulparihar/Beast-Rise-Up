
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Youtube, Flame } from 'lucide-react'

// ✅ All hrefs mapped to actual routes from AppRoutes
const footerLinks = [
  {
    title: "Shop",
    links: [
      { label: "All Products",  href: "/category/all" },
      { label: "Men",           href: "/category/men" },
      { label: "Women",         href: "/category/women" },
      { label: "Streetwear",    href: "/category/streetwear" },
      { label: "Gymwear",       href: "/category/gymwear" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My Profile",   href: "/account" },
      { label: "My Orders",    href: "/account/orders" },
      { label: "Wishlist",     href: "/account/wishlist" },
      { label: "Addresses",    href: "/account/addresses" },
      { label: "Settings",     href: "/account/settings" },
      { label: "Gift Vouchers",href: "/account/gift-vouchers" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us",      href: "/contact" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Refund Policy",   href: "/refund-policy" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy",  href: "/privacy-policy" },
      { label: "Terms of Service",href: "/terms" },
    ],
  },
]

const socials = [
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/beastriseup" },
  { icon: Twitter,   label: "Twitter",   href: "#" },
  { icon: Facebook,  label: "Facebook",  href: "#" },
  { icon: Youtube,   label: "YouTube",   href: "#" },
]

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">

        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">

          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 w-fit">
              <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center">
                <Flame className="text-red-500" size={18} />
              </div>
              <span className="text-xl font-black tracking-tight">
                <span className="text-gray-900">BEAST</span>
                <span className="text-red-600"> RISE UP</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm mb-6 max-w-xs leading-relaxed">
              Premium streetwear and gymwear for those who refuse to settle. Rise to your potential.
            </p>
            <div className="flex gap-3">
              {socials.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-600 hover:border-red-500 transition-colors shadow-sm"
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-gray-500 text-sm hover:text-red-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Beast Rise Up. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-gray-500 text-sm hover:text-red-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-500 text-sm hover:text-red-600 transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-gray-500 text-sm hover:text-red-600 transition-colors">
              Contact
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
