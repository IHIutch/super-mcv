import { json } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { Button, TextInput } from 'flowbite-react'
import { GripVertical, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useGetNanoId } from '../hooks/useGetNanoId'

export default function Index() {
  const [options, setOptions] = useState(['a', 'b', 'c'])

  const addOption = () => {
    setOptions([...options, ''])
  }

  const updateOption = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const removeOption = (index) => {
    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions)
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
            {options.map((option, idx) => (
              <div key={idx} className="mb-4 rounded-md bg-white p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="pr-4 text-slate-500">
                    <GripVertical />
                  </div>
                  <div className="flex-1">
                    <TextInput
                      name="option"
                      value={option}
                      onChange={(e) => updateOption(idx, e.target.value)}
                    />
                  </div>
                  {options.length > 1 ? (
                    <div className="pl-4 text-slate-500">
                      <Button onClick={() => removeOption(idx)} color="light">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            <div className="flex justify-center">
              <Button color="light" onClick={addOption}>
                Add an Option
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
  const options = formData.getAll('option')
  const uniqeSlug = useGetNanoId()
  return json({ uniqeSlug })
}
