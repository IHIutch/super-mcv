import React from 'react'

export default function Footer() {
  return (
    <div className="mt-64 border-t py-4 text-center">
      Special thanks to{' '}
      <a
        className="font-medium text-blue-500 underline"
        href="https://hashnode.com"
        target="_blank"
        rel="noreferrer"
      >
        Hashnode
      </a>{' '}
      and{' '}
      <a
        className="font-medium text-blue-500 underline"
        href="https://planetscale.com"
        target="_blank"
        rel="noreferrer"
      >
        PlanetScale
      </a>
      .
    </div>
  )
}
