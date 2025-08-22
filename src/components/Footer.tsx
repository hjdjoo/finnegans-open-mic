
// components/Footer.tsx
import Link from 'next/link'
import { EnvelopeIcon, MapPinIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'

export default function Footer() {
  return (
    <footer className="bg-dark-surface border-t border-dark-border mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Card */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <EnvelopeIcon className="h-6 w-6 text-irish-gold" />
              <h3 className="text-lg font-semibold">Contact Us</h3>
            </div>
            <p className="text-gray-400 mb-3">
              Questions about the open mic? Want to perform? Get in touch!
            </p>
            <a
              href="mailto:openmic@example.com"
              className="text-irish-gold hover:text-irish-gold-light transition-colors"
            >
              openmic@example.com
            </a>
          </div>

          {/* Directions Card */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <MapPinIcon className="h-6 w-6 text-irish-gold" />
              <h3 className="text-lg font-semibold">Find Us</h3>
            </div>
            <p className="text-gray-400 mb-3">
              {`Finnegan's Pub`}<br />
              {`734 Willow Ave`}<br />
              {`Hoboken, NJ 07030`}
            </p>
            <Link
              href="/directions"
              className="text-irish-gold hover:text-irish-gold-light transition-colors"
            >
              Get Directions →
            </Link>
          </div>

          {/* Schedule Card */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <CalendarDaysIcon className="h-6 w-6 text-irish-gold" />
              <h3 className="text-lg font-semibold">Every Sunday</h3>
            </div>
            <p className="text-gray-400 mb-3">
              Sign-ups: 7:00 PM<br />
              Show starts: 7:30 PM<br />
              All performers welcome!
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-green-500">Open Mic Active</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-dark-border text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Open Mic Night. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}