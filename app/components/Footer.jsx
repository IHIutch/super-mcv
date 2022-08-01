import React from 'react'

export default function Footer() {
  return (
    <div className="mt-64 border-t py-4 text-center">
      <div className="mb-2">
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
      <div>
        Find this app useful?{' '}
        <a
          className="font-medium text-blue-500 underline"
          href="https://www.buymeacoffee.com/ihiutch"
          target="_blank"
          rel="noreferrer"
        >
          Buy Me a Tea 🫖
        </a>
      </div>
    </div>
  )
}
