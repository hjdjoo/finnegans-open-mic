export default function AboutPage() {

  return (
    <div className="min-h-screen pt-28 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-3xl md:text-4xl text-gray-200 font-bold mb-8">About Our Open Mic</h1>
        <div className="prose prose-invert prose-lg max-w-none">
          <div className="card mb-8">
            <p className="text-gray-300 leading-relaxed">
              {`Every Sunday night, the back room at Finnegan's becomes a space where musicians come together to hang out, perform, and listen.`}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="card">
              <h2 className="text-xl font-bold text-irish-gold mb-3">For The Performers</h2>
              <p className="text-gray-400">
                {`Sign-ups begin around 7PM. The host (Darryl) will start with a few songs to warm up the night, after which performers begin their sets.`}
              </p>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold text-irish-gold mb-3">For The Audience</h2>
              <p className="text-gray-400">
                {`Come take a seat, order a drink, grab some delicious food from the kitchen, and observe your local musicians in their natural environment! Be mindful of your noise levels, performers may spook.`}
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-irish-gold mb-3">House Rules</h2>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-irish-gold rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                <span>{`Music only! (Backing tracks okay)`}</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-irish-gold rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                <span>{`Each performer gets 3 songs (2 if the list is too long)`}</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-irish-gold rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                <span>{`Sign-ups are first-come, first-served starting around 7:00 PM`}</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-irish-gold rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                <span>{`Original material and covers both welcome (but we do love our original music)`}</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-irish-gold rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                <span>{`Be respectful of all performers and audience members`}</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-irish-gold rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                <span>{`The host will *not* ask the audience to be quiet; it is up to you as the performer to capture the crowd!`}</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-irish-gold rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                <span>{`Please use the provided splash rods for the drum kit; no sticks! (Drummers can thank that one band that came in a few years ago.)`}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}