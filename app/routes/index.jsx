import { json } from '@remix-run/node'
import { Form } from '@remix-run/react'
import clsx from 'clsx'
import { Button, TextInput } from 'flowbite-react'
import { GripVertical, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useGetNanoId } from '../hooks/useGetNanoId'

export default function Index() {
  const [items, setItems] = useState(['a', 'b', 'c'])
  const [isWindowReady, setIsWindowReady] = useState(false)

  useEffect(() => {
    setIsWindowReady(true)
  }, [])

  const addItem = () => {
    setItems([...items, ''])
  }

  const updateItem = (index, value) => {
    const newItems = [...items]
    newItems[index] = value
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
    // dropped outside the list
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
          <div className="mb-8 rounded-md border border-slate-300 bg-slate-200 p-4">
            {isWindowReady ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {items.map((item, idx) => (
                        <Draggable key={item} draggableId={item} index={idx}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-4"
                            >
                              <div
                                className={clsx(
                                  'rounded-md bg-white p-4 transition-all',
                                  snapshot.isDragging
                                    ? 'user-select-none scale-105 shadow-2xl'
                                    : 'scale-100 shadow-sm'
                                )}
                              >
                                <div className="flex items-center">
                                  <div className="pr-4 text-slate-500">
                                    <GripVertical />
                                  </div>
                                  <div className="flex-1">
                                    <TextInput
                                      name="item"
                                      value={item}
                                      onChange={(e) =>
                                        updateItem(idx, e.target.value)
                                      }
                                    />
                                  </div>
                                  {items.length > 1 ? (
                                    <div className="pl-4 text-slate-500">
                                      <Button
                                        onClick={() => removeItem(idx)}
                                        color="light"
                                      >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </div>
                                  ) : null}
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
            ) : null}
            <div className="flex justify-center">
              <Button color="light" onClick={addItem}>
                Add an Item
              </Button>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Launch Poll!</Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export async function action({ request }) {
  const formData = await request.formData()
  const items = formData.getAll('item')
  const uniqeSlug = useGetNanoId()
  return json({ uniqeSlug })
}
