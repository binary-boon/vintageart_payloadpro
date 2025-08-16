// src/app/(frontend)/products/[slug]/loading.tsx
export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Skeleton */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
            <span>/</span>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            <span>/</span>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex space-x-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <div>
              <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="flex space-x-2 mb-4">
                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Variants Skeleton */}
            <div className="bg-white p-6 rounded-lg border">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                <div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="grid grid-cols-2 gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-8 bg-gray-100 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="h-4 w-36 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="grid grid-cols-2 gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-8 bg-gray-100 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Button Skeleton */}
            <div className="bg-white p-6 rounded-lg border">
              <div className="h-12 w-full bg-amber-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
