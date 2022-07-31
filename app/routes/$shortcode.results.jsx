import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import React, { useState } from 'react'
import { prismaGetResponses } from '../utils/prisma/responses.server'
import { prismaGetSurvey } from '../utils/prisma/surveys.server'
import countBy from 'lodash/countBy'
import clsx from 'clsx'

export default function SurveyReuslts() {
  const { survey, roundChoices, winner } = useLoaderData()
  const [sliderValue, setSliderValue] = useState(winner.winningRoundIdx + 1)

  return (
    <div className="min-h-screen bg-slate-100 py-20">
      <div className="mx-auto max-w-screen-md">
        <div className="mb-8">
          <div className="mb-12 text-center">
            <h1 className="mb-1 text-5xl font-bold">{survey.question}</h1>
            <p className="text-xl font-light text-slate-600">Results</p>
          </div>
          <div className="mb-12">
            {survey.choices.map((choice, idx) => (
              <div
                key={idx}
                className={clsx(
                  choice === winner.choice
                    ? 'border-blue-500'
                    : 'border-transparent',
                  'mb-4 rounded-lg border-2 p-4'
                )}
              >
                <div>
                  <p className="text-xl font-bold">{choice}</p>
                </div>
                <div className="flex flex-1">
                  {roundChoices[sliderValue - 1].map((r, rIdx) => (
                    <div key={rIdx} className="flex-1 px-1">
                      <div
                        className={clsx(
                          r.choices[0] === choice
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-300',
                          'flex h-12 items-center justify-center rounded'
                        )}
                      >
                        {r.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div>
            <label
              htmlFor="roundRangeSlider"
              className="mb-2 block text-sm font-medium text-gray-900 "
            >
              Rounds: {sliderValue}
            </label>
            <input
              id="roundRangeSlider"
              type="range"
              min="1"
              max={roundChoices.length}
              value={sliderValue}
              onChange={(e) => setSliderValue(e.target.value)}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
            />
          </div>
          {/* <pre>{JSON.stringify(roundChoices, null, 2)}</pre> */}
        </div>
      </div>
    </div>
  )
}

export const meta = ({ data }) => {
  const { survey } = data
  return {
    title: 'Results | ' + survey.question,
    description: 'Never let a vote go to waste',
  }
}

export const loader = async ({ params }) => {
  const { shortcode } = params

  const survey = await prismaGetSurvey({ shortcode })
  const [responses] = await Promise.all([
    prismaGetResponses({ surveyId: survey.id }),
  ])

  const mappedResponses = responses.map((r) => {
    return {
      name: r.name,
      choices: r.choices.map((c) => c.value),
      createdAt: new Date(r.createdAt).toJSON(),
    }
  })

  let roundCount = 0
  let roundChoices = []
  let winner = null
  let tempResponses = [...mappedResponses]
  while (roundCount < survey.choices.length) {
    roundChoices.push(tempResponses)

    const countedResponses = countBy(
      tempResponses.map((r) => r.choices[0]),
      (v) => v
    )

    const { most: mostPicked, least: leastPicked } = Object.entries(
      countedResponses
    ).reduce(
      (acc, [key, value]) => {
        if (!acc.most || value > acc.most.count) {
          acc['most'] = { choice: key, count: value }
          return acc
        }
        if (!acc.least || value < acc.least.count) {
          acc['least'] = { choice: key, count: value }
          return acc
        }
        return acc
      },
      {
        most: null,
        least: null,
      }
    )

    if (mostPicked.count > responses.length / 2) {
      winner = {
        ...mostPicked,
        winningRoundIdx: roundCount,
      }
      break
    }

    tempResponses = tempResponses.map((r) => {
      if (r.choices[0] === leastPicked.choice) {
        return {
          ...r,
          choices: r.choices.slice(1),
        }
      }
      return r
    })

    roundCount++
  }

  return json({
    survey,
    winner,
    roundChoices,
  })
}
