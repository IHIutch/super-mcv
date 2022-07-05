import { json } from '@remix-run/node'
import { Form } from '@remix-run/react'
import clsx from 'clsx'
import { Button } from 'flowbite-react'
import { GripVertical, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  resetServerContext,
} from 'react-beautiful-dnd'
import GrowingTextarea from '../components/GrowingTextarea'
import { getNanoId } from '../utils/functions'

export default function Index() {
  const [items, setItems] = useState([
    { uniqueId: '1', value: 'a' },
    { uniqueId: '2', value: 'b' },
    { uniqueId: '3', value: 'c' },
  ])
  const [isWindowReady, setIsWindowReady] = useState(false)

  useEffect(() => {
    setIsWindowReady(true)
  }, [])

  const addItem = () => {
    setItems([...items, { id: getNanoId(), value: '' }])
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
                                    name="item"
                                    value={item.value}
                                    onChange={(e) =>
                                      updateItem(idx, e.target.value)
                                    }
                                  />
                                </div>
                                <div className="p-4 text-slate-500">
                                  <Button
                                    onClick={() => removeItem(idx)}
                                    color="light"
                                    disabled={items.length <= 2}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
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
  console.log({ items })
  const uniqeSlug = getNanoId()
  return json({ uniqeSlug })
}
