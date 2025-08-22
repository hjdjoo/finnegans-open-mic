export default function DirectionsPage() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Getting Here</h1>

        <div className="grid gap-6">
          <div className="card flex items-center">
            <div>
              <h2 className="text-xl font-semibold text-irish-gold mb-4">Address</h2>
              <p className="text-gray-300">
                {`Finnegan's Pub`}<br />
                {`734 Willow Ave`}<br />
                {`Hoboken, NJ 07030`} <br />
              </p>
              <p className=" text-gray-300 text-xs mt-1">
                {`Located on the corner of Willow Ave and 8th St.`}
              </p>
            </div>
            <div>

            </div>
          </div>
          <div className="card">
            <h2 className="text-xl font-semibold text-irish-gold mb-4">Parking</h2>
            <p className="text-gray-400 mb-3">
              {`Street parking is available on Main Street and surrounding blocks. 
              There's also a public parking garage nearby at 371 4th St,
              about a 10-minute walk from the pub.`}
            </p>
            <p className="text-sm text-gray-500">
              {`Note: Street Parking is free on Sundays.`}
            </p>
          </div>

          <div className="card bg-irish-green/10 border-irish-green/30">
            <h2 className="text-xl font-semibold text-irish-gold mb-4">Landmark</h2>

          </div>
        </div>
      </div>
    </div>
  )
}