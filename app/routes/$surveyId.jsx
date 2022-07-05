import React, { useState } from 'react'
import { Form, useLoaderData, useParams } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import {
  DragDropContext,
  Draggable,
  Droppable,
  resetServerContext,
} from 'react-beautiful-dnd'
import clsx from 'clsx'
import { GripVertical } from 'lucide-react'
import { Button, Label, TextInput } from 'flowbite-react'
import shuffle from 'lodash/shuffle'

export default function Survey() {
  const params = useParams()
  const { surveyId } = params
  const { choices, question } = useLoaderData()
  const [tempChoices, setTempChoices] = useState(choices)

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
          <h1 className="mb-1 text-5xl font-bold">{question}</h1>
          <p className="text-xl font-light text-slate-600">{surveyId}</p>
        </div>
        <Form method="post">
          <div className="mb-4 px-4">
            <div className="mb-1">
              <Label htmlFor="name">Your Name</Label>
            </div>
            <TextInput id="name" name="name" required />
          </div>
          <div className="mb-8 rounded-md border border-slate-300 bg-slate-200 p-4">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {tempChoices.map((choice, idx) => (
                      <Draggable
                        key={choice.uniqueId}
                        draggableId={choice.uniqueId}
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
                                    name="answers"
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
          <div className="flex justify-end">
            <Button type="submit">Submit Answers</Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export const loader = async () => {
  const choices = shuffle([
    { uniqueId: '1', value: 'a' },
    { uniqueId: '2', value: 'b' },
    { uniqueId: '3', value: 'c' },
  ]).map((c, idx) => ({ ...c, startingIdx: idx }))

  return json({
    choices,
    question: 'Rank your favorite colors!',
  })
}

export async function action({ request, params }) {
  const { surveyId } = params
  const formData = await request.formData()
  const name = formData.get('name')
  const answers = formData.getAll('answers').map((a) => JSON.parse(a))
  console.log({ answers, name, surveyId })
  return redirect(`${surveyId}/results`)
}
