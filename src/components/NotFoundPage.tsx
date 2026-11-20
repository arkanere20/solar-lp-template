import { Link } from '@tanstack/react-router'
import { site } from '../data/site'

export function NotFoundPage() {
  return (
    <main className="mx-auto max-w-2xl p-8 py-24 text-center">
      <h1 className="text-3xl font-extrabold text-forest-950">
        Page not found
      </h1>
      <p className="mt-3 text-gray-600">
        The page you’re looking for doesn’t exist.
      </p>
      <Link to="/" className="btn-sun mt-8">
        Back to {site.name}
      </Link>
    </main>
  )
}
