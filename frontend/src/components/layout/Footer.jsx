import React from 'react'
import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

const footerLinks = [
  { title: "Shop", links: ["Men", "Women", "Streetwear", "Gymwear", "New Arrivals", "Sale"] },
  { title: "Company", links: ["About Us", "Careers", "Blog", "Press", "Sustainability"] },
  { title: "Support", links: ["Contact", "FAQ", "Shipping", "Returns", "Size Guide", "Track Order"] },
  { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
]

const socials = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
]


const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <a href="/" className="text-xl font-black tracking-tight mb-4 inline-block">
              <span className="text-gray-900">BEAST</span>
              <span className="text-red-600"> RISE UP</span>
            </a>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">
              Premium streetwear and gymwear for those who refuse to settle. Rise to your potential.
            </p>
            <div className="flex gap-3">
              {socials.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
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

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-bold text-gray-900 mb-4 text-sm">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-500 text-sm hover:text-red-600 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">© 2025 Beast Rise Up. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 text-sm hover:text-red-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 text-sm hover:text-red-600 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
