import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { json } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { Button, TextInput } from 'flowbite-react'
import { GripVertical, Trash2 } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { useGetNanoId } from '../hooks/useGetNanoId'

export default function Index() {
  const [activeId, setActiveId] = useState(null)
  const [items, setItems] = useState(['a', 'b', 'c'])

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event) => {
    console.log(event)

    const { active, over } = event

    if (active && over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)
        const test = arrayMove(items, oldIndex, newIndex)
        console.log({ test })
        return test
      })
    }
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
            <DndContext
              sensors={sensors}
              onDragEnd={handleDragEnd}
              onDragStart={({ active }) => setActiveId(active.id)}
            >
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
                collisionDetection={closestCenter}
              >
                {items.map((item, idx) => (
                  <SortableItem
                    key={idx}
                    idx={item}
                    value={item}
                    onChange={(e) => updateItem(idx, e.target.value)}
                    removeItem={() => removeItem(idx)}
                    isShowingDelete={items.length > 1}
                  />
                ))}
              </SortableContext>
              <DragOverlay>{activeId ? <Item /> : null}</DragOverlay>
            </DndContext>
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

const SortableItem = ({
  idx,
  value,
  onChange,
  removeItem,
  isShowingDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: idx })

  console.log({ transform, transition })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Item
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      value={value}
      onChange={onChange}
      removeItem={removeItem}
      isShowingDelete={isShowingDelete}
    />
  )
}

const Item = forwardRef(
  ({ onChange, value, isShowingDelete, removeItem, ...props }, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className="mb-4 rounded-md bg-white p-4 shadow-sm"
      >
        <div className="flex items-center">
          <div className="pr-4 text-slate-500">
            <GripVertical />
          </div>
          <div className="flex-1">
            <TextInput name="item" value={value} onChange={onChange} />
          </div>
          {isShowingDelete > 1 ? (
            <div className="pl-4 text-slate-500">
              <Button onClick={removeItem} color="light">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    )
  }
)

export async function action({ request }) {
  const formData = await request.formData()
  const items = formData.getAll('item')
  const uniqeSlug = useGetNanoId()
  return json({ uniqeSlug })
}
