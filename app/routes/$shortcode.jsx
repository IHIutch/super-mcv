import React, { useState } from 'react'
import { Form, useLoaderData } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import {
  DragDropContext,
  Draggable,
  Droppable,
  resetServerContext,
} from 'react-beautiful-dnd'
import clsx from 'clsx'
import { GripVertical } from 'lucide-react'
import shuffle from 'lodash/shuffle'
import { prismaGetSurvey } from '../utils/prisma/surveys.server'
import { prismaCreateResponse } from '../utils/prisma/responses.server'

export default function Survey() {
  const { survey } = useLoaderData()

  const [tempChoices, setTempChoices] = useState(survey.choices)

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return
    }

    const newChoices = reorder(
      tempChoices,
      result.source.index,
      result.destination.index
    )

    setTempChoices(newChoices)
  }

  resetServerContext()

  return (
    <div className="min-h-screen bg-slate-100 py-20">
      <div className="mx-auto max-w-screen-md">
        <div className="mb-8 text-center">
          <h1 className="mb-1 text-5xl font-bold">{survey.question}</h1>
        </div>
        <Form method="post">
          <div className="mb-4 px-4">
            <div className="mb-1">
              <label
                htmlFor="name"
                className="mb-2 text-sm font-medium text-gray-900"
              >
                Your Name
              </label>
            </div>
            <input
              id="name"
              name="name"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-8 rounded-md border border-slate-300 bg-slate-200 px-4 pt-4">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {tempChoices.map((choice, idx) => (
                      <Draggable
                        key={choice.startingIndex.toString()}
                        draggableId={choice.startingIndex.toString()}
                        index={idx}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-4"
                          >
                            <div
                              className={clsx(
                                'rounded-md bg-white transition-all',
                                snapshot.isDragging && !snapshot.isDropAnimating
                                  ? 'scale-[1.03] shadow-xl'
                                  : 'scale-100 shadow-sm'
                              )}
                            >
                              <div className="flex items-center">
                                <div className="py-6 px-2 text-slate-500">
                                  <GripVertical />
                                </div>
                                <div className="flex-1 py-4 pl-1">
                                  {choice.value} {choice.startingIdx}
                                  <input
                                    type="hidden"
                                    name="choices"
                                    value={JSON.stringify(choice)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <input type="hidden" name="surveyId" value={survey.id} />
          <div className="flex justify-end">
            <button
              type="submit"
              className="mr-2 mb-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Submit Answers
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export const loader = async ({ params }) => {
  const { shortcode } = params
  const survey = await prismaGetSurvey({ shortcode })

  const surveyChoices = survey.choices.map((c, idx) => ({
    originalIndex: idx,
    value: c,
  }))

  const shuffledChoices = shuffle(surveyChoices).map((c, idx) => ({
    ...c,
    startingIndex: idx,
  }))

  return json({
    survey: {
      ...survey,
      choices: shuffledChoices,
    },
  })
}

export async function action({ request, params }) {
  const { shortcode } = params
  const formData = await request.formData()
  const surveyId = Number(formData.get('surveyId'))
  const name = formData.get('name')
  const choices = formData.getAll('choices').map((c) => JSON.parse(c))

  await prismaCreateResponse({ name, choices, surveyId })

  return redirect(`${shortcode}/results`)
}
