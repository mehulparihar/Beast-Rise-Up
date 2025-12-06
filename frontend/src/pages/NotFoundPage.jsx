"use client"

import { motion } from "framer-motion"
import { Flame, Home, Search } from "lucide-react"
import { Link } from "react-router-dom"


const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-xl">
          {/* 404 Number */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mb-8"
          >
            <span className="text-[150px] sm:text-[200px] font-black text-secondary leading-none select-none">404</span>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="w-20 h-20 bg-foreground rounded-2xl flex items-center justify-center">
                <Flame className="text-accent" size={40} />
              </div>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-4">Page Not Found</h1>
            <p className="text-muted-foreground text-lg mb-10">
              Looks like this page got lost in the gym. Let&apos;s get you back on track.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background font-bold rounded-xl hover:bg-foreground/90 transition-colors"
            >
              <Home size={18} />
              Back to Home
            </Link>
            <Link
              href="/#shop"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-foreground font-semibold rounded-xl hover:bg-secondary/80 transition-colors"
            >
              <Search size={18} />
              Browse Products
            </Link>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 pt-8 border-t border-border"
          >
            <p className="text-sm text-muted-foreground mb-4">Popular destinations</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {["New Arrivals", "Men", "Women", "Streetwear", "Gymwear", "Sale"].map((link) => (
                <Link
                  key={link}
                  href={`/#${link.toLowerCase().replace(" ", "-")}`}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage