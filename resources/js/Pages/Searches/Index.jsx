import AppLayout from '@/Layouts/AppLayout'
import { Link, router } from '@inertiajs/react'

const Index = ({ searches }) => {
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Saved Searches</h1>

      {searches.length === 0 && (
        <p className="text-gray-500">
          You have no saved searches yet.
        </p>
      )}

      <div className="space-y-4">
        {searches.map(search => (
          <div
            key={search.id}
            className="flex items-start justify-between p-4 border rounded"
          >
            <div>
              <h2 className="text-lg font-semibold">
                {search.name}
              </h2>

              <div className="text-sm text-gray-500">
                {Object.entries(search.search_parameters).map(
                  ([key, value]) => (
                    <span key={key} className="mr-2">
                      {key}: <strong>{value}</strong>
                    </span>
                  )
                )}
              </div>

              {!search.is_active && (
                <span className="text-xs text-red-500">
                  Inactive
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <Link
                href={route('marketplace.index', search.search_parameters)}
                className="btn btn-sm btn-outline"
              >
                View
              </Link>

              <button
                className="btn btn-sm"
                onClick={() =>
                  router.patch(route('saved-searches.toggle', search.id))
                }
              >
                {search.is_active ? 'Disable' : 'Enable'}
              </button>

              <button
                className="btn btn-sm btn-error"
                onClick={() =>
                  confirm('Delete this search?') &&
                  router.delete(route('saved-searches.destroy', search.id))
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

Index.layout = page => <AppLayout>{page}</AppLayout>

export default Index
