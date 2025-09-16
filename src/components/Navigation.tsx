'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

const DEV = process.env.NODE_ENV === "development"

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Past Mics', href: '/past' },
  { name: 'The Notebook', href: '/notebook' },
  { name: 'Contact', href: '/contact' },
  { name: 'Directions', href: '/directions' },
]

if (DEV) {
  navLinks.push({ name: 'Admin', href: '/admin' });
}

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-dark-bg/95 backdrop-blur-md border-b border-dark-border'
          : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center mx-1 group">
            <div className="relative w-20 h-20 transition-transform duration-200 group-hover:scale-110">
              <Image
                src="logo.svg"
                alt="Open Mic Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-serif font-bold font-stretch-condensed text-gray-300 group-hover:text-irish-gold-light transition-transform duration-200">
              <span className="text-2xl">{`T`}</span><span className="text-lg">{`HE `}</span>
              <span className="text-2xl">{`M`}</span><span className="text-lg">{`USICIANS' `}</span>
              <span className="text-2xl">{`O`}</span><span className="text-lg">{`PEN `}</span>
              <span className="text-2xl">{`M`}</span><span className="text-lg">{`IC `}</span>
              <span className="text-lg">{`A`}</span><span className="text-lg">{`T`}</span>
              <br />
              <span className="text-3xl">{`F`}</span><span className="text-xl">{`INNEGAN'S `}</span>
              <span className="text-3xl">{`P`}</span><span className="text-xl">{`UB`}</span>
            </span>
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  'relative py-2 text-sm font-medium transition-colors duration-200',
                  pathname === link.href
                    ? 'text-irish-gold'
                    : 'text-gray-300 hover:text-white'
                )}
              >
                {link.name}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-irish-gold animate-fade-in" />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-irish-gold rounded-lg"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 animate-slide-up">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    'px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                    pathname === link.href
                      ? 'bg-irish-green/20 text-irish-gold'
                      : 'text-gray-300 hover:bg-dark-surface hover:text-white'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}