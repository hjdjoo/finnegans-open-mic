import { EnvelopeIcon, PhoneIcon, ClockIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <span className="flex items-center mb-8">
          <ChatBubbleLeftRightIcon className="text-irish-gold w-8 h-8" />
          <h1 className="text-3xl md:text-4xl font-bold ml-2">Contact Us</h1>
        </span>

        <div className="grid gap-6">
          <div className="card">
            <div className="flex items-start space-x-4">
              <EnvelopeIcon className="h-6 w-6 text-irish-gold flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Email</h2>
                <p className="text-gray-400 mb-2">
                  For inquiries, questions, or feedback:
                </p>
                <a
                  href="mailto:openmic@example.com"
                  className="text-irish-gold hover:text-irish-gold-light transition-colors"
                >
                  finnegansopenmic@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start space-x-4">
              <PhoneIcon className="h-6 w-6 text-irish-gold flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Phone</h2>
                <p className="text-gray-400 mb-2">
                  Or call the pub during business hours:
                </p>
                <a
                  href="tel:+1234567890"
                  className="text-irish-gold hover:text-irish-gold-light transition-colors"
                >
                  (201) 217-1512
                </a>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start space-x-4">
              <ClockIcon className="h-6 w-6 text-irish-gold flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Open Mic Hours</h2>
                <p className="text-gray-400">
                  Every Sunday<br />
                  Sign-ups: 7:00 PM<br />
                  Performances: 7:30 PM - Close
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}