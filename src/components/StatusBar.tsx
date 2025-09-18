'use client'

import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface StatusCardProps {
  status: {
    active: boolean
    next_date: string | null
    message: string
  }
}

export default function StatusCard({ status }: StatusCardProps) {
  const nextSunday = new Date()
  const day = nextSunday.getDay()
  const daysUntilSunday = day === 0 ? 0 : 7 - day
  nextSunday.setDate(nextSunday.getDate() + daysUntilSunday)

  const dateString = nextSunday.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="max-w-full mx-auto py-4 ">
      <div className={clsx(
        'relative overflow-hidden transition-all duration-300'
      )}>
        <div className="relative flex items-center">
          <div className="flex grow-3 items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-sm md:text-lg font-bold">{"Is there open mic this week?"} </h2>
            </div>
          </div>

          <div className="flex grow-1 items-center justify-end bg-dark-bg/50 rounded-lg">


            <div className="flex ml-2 my-auto items-center justify-between bg-dark-bg/50 rounded-lg">
              <span className="text-gray-300 text-xs md:text-lg">{status.active ? "Yes" : "No"}{`, we are`}</span>
              <span className={clsx(
                'font-bold text-xs md:text-lg ml-2',
                status.active ? 'text-green-500' : 'text-red-500'
              )}>
                {status.active ? 'ON' : 'OFF'}
              </span>
              <span className="ml-2 text-xs md:text-lg text-gray-300">for</span>
              <span className="text-xs md:text-lg text-irish-gold ml-2">
                {status.next_date || dateString}
              </span>
              <span className={clsx(
                'font-bold text-xs md:text-lg ml-2',
                status.active ? 'text-green-500' : 'text-red-500'
              )}>
                {status.active ? (
                  <CheckCircleIcon className="h-4 w-4 md:h-6 md:w-6 text-green-500" />
                ) : (
                  <XCircleIcon className="h-4 w-4 md:h-6 md:w-6 text-red-500" />
                )}
              </span>
            </div>

          </div>
          <div className="flex space-y-4 grow-1 justify-end">
            {status.message.length && (
              <div className="p-4 bg-irish-green/10 border border-irish-green/30 rounded-lg">
                <p className="font-bold text-end text-xs md:text-sm text-gray-300">Message: </p>
                <p className="text-xs md:text-sm text-gray-300">{status.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}