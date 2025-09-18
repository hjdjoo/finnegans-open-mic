'use client'

export default function ErrorPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Error!</h1>
      <p className="text-gray-300">An unexpected error has occurred. Please try again later.</p>
    </div>
  );
}