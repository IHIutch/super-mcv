import React from 'react'
import clsx from 'clsx'

const GrowingTextarea = ({ value, onChange, className, ...props }) => {
  const sharedStyles = 'border py-2 px-3'
  const textareaStyles =
    'absolute top-0 left-0 h-full w-full resize-none overflow-hidden'
  const growableStyles = 'invisible min-h-[2.625rem] whitespace-pre-wrap'

  return (
    <div className={clsx('relative')}>
      <div aria-hidden="true" className={clsx(sharedStyles, growableStyles)}>
        {value}
      </div>
      <textarea
        className={clsx(
          sharedStyles,
          textareaStyles,
          'focus:blue-indigo-500 block rounded-md border-gray-300 bg-gray-50 focus:border-blue-500',
          className
        )}
        {...props}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default GrowingTextarea
