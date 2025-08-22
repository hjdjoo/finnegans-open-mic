export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">About Open Mic Night</h1>

        <div className="prose prose-invert prose-lg max-w-none">
          <div className="card mb-8">
            <p className="text-gray-300 leading-relaxed">
              {`Every Sunday night, Finnegan's transforms into a vibrant showcase of local talent.
              Since our founding, we've been dedicated to providing a welcoming space for musicians to share their craft with an appreciative audience.`}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="card">
              <h2 className="text-xl font-bold text-irish-gold mb-3">For Performers</h2>
              <p className="text-gray-400">
                {` Whether you're a seasoned performer or taking the stage for the first time,
                our open mic is a supportive environment to share your talent. Sign-ups start
                at 7:00 PM on a first-come, first-served basis.`}
              </p>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold text-irish-gold mb-3">For the Audience</h2>
              <p className="text-gray-400">
                {`Experience the raw energy of live performance in an intimate setting.
                Every week brings new surprises, all in the warm atmosphere of our historic pub.`}
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-irish-gold mb-3">House Rules</h2>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-irish-gold rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                <span>{`Each performer gets 3 songs`}</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-irish-gold rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                <span>{`Sign-ups are first-come, first-served starting at 7:00 PM`}</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-irish-gold rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                <span>{`Be respectful of all performers and audience members`}</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-irish-gold rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                <span>{`Original material and covers are both welcome`}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}