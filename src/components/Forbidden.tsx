import Link from "next/link";

export default function Forbidden() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-lvw h-lvh">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">403 - Forbidden</h1>
      <p className="text-gray-300">You do not have permission to access this page.</p>
      {/* return to home: */}
      <Link href="/" className="text-irish-gold hover:text-irish-gold-light transition-colors mt-4 inline-block">
        Return to Home
      </Link>
    </div>
  )
}