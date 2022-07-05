import { json } from '@remix-run/node'
import { useLoaderData, useParams } from '@remix-run/react'
import React from 'react'
import { prismaGetResponses } from '../utils/prisma/responses.server'
import { prismaGetSurvey } from '../utils/prisma/surveys.server'

export default function SurveyReuslts() {
  const params = useParams()
  const { surveyId } = params
  const { survey, responses } = useLoaderData()
  return (
    <div className="min-h-screen bg-slate-100 py-20">
      <div className="mx-auto max-w-screen-md">
        <div className="mb-8 text-center">
          <h1 className="mb-1 text-5xl font-bold">Results</h1>
          <h2>{survey.question}</h2>
          <p className="text-xl font-light text-slate-600">{surveyId}</p>
          <pre>{JSON.stringify(responses, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}

export const loader = async ({ params }) => {
  const { surveyId } = params

  const [survey, responses] = await Promise.all([
    await prismaGetSurvey({ shareId: surveyId }),
    await prismaGetResponses({ name: 'Test' }),
  ])

  return json({
    survey,
    responses,
  })
}
