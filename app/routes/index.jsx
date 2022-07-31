import { redirect } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import clsx from 'clsx'
import { GripVertical, Trash2 } from 'lucide-react'
import { useState } from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  resetServerContext,
} from 'react-beautiful-dnd'
import GrowingTextarea from '../components/GrowingTextarea'
import { getNanoId } from '../utils/functions'
import { prismaCreateSurvey } from '../utils/prisma/surveys.server'

export default function Index() {
  const { placeholderValue } = useLoaderData()

  const [items, setItems] = useState(placeholderValue)
  const addItem = () => {
    setItems([...items, { uniqueId: getNanoId(), value: '' }])
  }

  const updateItem = (index, value) => {
    const newItems = [...items]
    newItems[index]['value'] = value
    setItems(newItems)
  }

  const removeItem = (index) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
  }

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

    const newItems = reorder(
      items,
      result.source.index,
      result.destination.index
    )

    setItems(newItems)
  }

  resetServerContext()

  return (
    <div className="min-h-screen bg-slate-100 py-20">
      <div className="mx-auto max-w-screen-md">
        <div className="mb-8 text-center">
          <h1 className="mb-1 text-5xl font-bold">
            Super Ranked Choice Voting!
          </h1>
          <p className="text-xl font-light text-slate-600">
            Ranked Choice Voting is the ultimate voting style.
          </p>
        </div>
        <Form method="post">
          <div className="mb-4 px-4">
            <div className="mb-1">
              <label
                htmlFor="question"
                className="mb-2 text-sm font-medium text-gray-900"
              >
                Your Question
              </label>
            </div>
            <input
              id="question"
              name="question"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-8 rounded-md border border-slate-300 bg-slate-200 p-4">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {items.map((item, idx) => (
                      <Draggable
                        key={item.uniqueId}
                        draggableId={item.uniqueId}
                        index={idx}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
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
                                <div
                                  className="py-6 px-2 text-slate-500"
                                  {...provided.dragHandleProps}
                                >
                                  <GripVertical />
                                </div>
                                <div className="flex-1 py-4 pl-1">
                                  <GrowingTextarea
                                    name="choices"
                                    value={item.value}
                                    onChange={(e) =>
                                      updateItem(idx, e.target.value)
                                    }
                                  />
                                </div>
                                <div className="p-4 text-slate-500">
                                  <button
                                    type="button"
                                    onClick={() => removeItem(idx)}
                                    className="mr-2 mb-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200"
                                    disabled={items.length <= 2}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </button>
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
            <div className="flex justify-center">
              <button
                type="button"
                className='className="mr-2 focus:ring-gray-200" mb-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4'
                onClick={addItem}
              >
                Add an Item
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="mr-2 mb-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Launch Poll!
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export const loader = async () => {
  const placeholderValue = [...Array(3)].map(() => ({
    uniqueId: getNanoId(),
    value: '',
  }))

  return {
    placeholderValue,
  }
}

export async function action({ request }) {
  const formData = await request.formData()
  const question = formData.get('question')
  const choices = formData.getAll('choices')
  const shortcode = getNanoId()

  await prismaCreateSurvey({ question, choices, shortcode })

  return redirect(`/${shortcode}`)
}
