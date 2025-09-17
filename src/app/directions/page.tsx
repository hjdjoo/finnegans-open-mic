import Image from "next/image"

const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

export default function DirectionsPage() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Getting Here</h1>

        <div className="grid gap-6">
          <div className="card flex items-center justify-between">
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
              <iframe
                width="450"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=${MAPS_API_KEY}&q=734+Willow+Ave,Hoboken+NJ`}>
              </iframe>
            </div>
            <div>

            </div>
          </div>
          <div className="card">
            <h2 className="text-xl font-semibold text-irish-gold mb-4">Parking</h2>
            <p className="text-gray-400 mb-2">
              {`Street parking is available on the surrounding blocks. Bus stops on Clinton St are not active on Sundays, which may be an option.`}
            </p>
            <p className="text-gray-400 mb-2">
              {`If surrounding blocks are full, parking on Washington Ave and walking ~5 min to the pub may be the best option.`}
            </p>
            <p className="text-gray-400 mb-2">
              {`There are also parking garages in the area.`}
            </p>
            <p className="text-sm text-gray-400">
              {`Note: Make sure you park on the side of the street without the solid green "residents only" signs.`}
            </p>
            <div className="card flex flex-row items-center justify-evenly">
              <div className="flex flex-col j">
                <div className="relative grow-1 min-h-[300px] ">
                  <Image src="/hoboken_parking_yes.jpg" fill objectFit="contain" sizes={"(max-width-200)"} alt="hoboken parking permitted image" />
                </div>
                <div>
                  <p>Parking Permitted</p>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <div className="relative grow-1 min-h-[300px] ">
                  <Image src="/hoboken_parking_no.jpg" fill objectFit="contain" sizes={"(max-width-200)"} alt="hoboken parking NOT permitted image" />
                </div>
                <div>
                  <p>Parking NOT Permitted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}