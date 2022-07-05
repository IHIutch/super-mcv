import { json } from '@remix-run/node'
import { useLoaderData, useParams } from '@remix-run/react'
import React from 'react'

export default function SurveyReuslts() {
  const params = useParams()
  const { surveyId } = params
  const { question } = useLoaderData()
  return (
    <div className="min-h-screen bg-slate-100 py-20">
      <div className="mx-auto max-w-screen-md">
        <div className="mb-8 text-center">
          <h1 className="mb-1 text-5xl font-bold">Results</h1>
          <h2>{question}</h2>
          <p className="text-xl font-light text-slate-600">{surveyId}</p>
        </div>
      </div>
    </div>
  )
}

export const loader = async ({ params }) => {
  return json({
    question: 'Rank your favorite colors!',
  })
}
