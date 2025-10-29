import { useState } from 'react'
import { 
  publicService, 
  userService, 
  laptopService, 
  assignmentService,
  returnLeasingService,
  repairService 
} from '../api/services'

export default function ApiTest() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const testEndpoint = async (serviceFn, label) => {
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      const data = await serviceFn()
      setResult({ label, data })
      console.log(`✅ ${label}:`, data)
    } catch (err) {
      setError({ label, message: err.message, status: err.response?.status })
      console.error(`❌ ${label}:`, err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Endpoint Tester</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Public Endpoints */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Public</h2>
          <button
            onClick={() => testEndpoint(publicService.hello, 'GET /api/hello')}
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            disabled={loading}
          >
            Test Hello
          </button>
        </div>

        {/* User Endpoints */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Users</h2>
          <button
            onClick={() => testEndpoint(userService.getAll, 'GET /api/users')}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            Get All Users
          </button>
        </div>

        {/* Laptop Endpoints */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Laptops</h2>
          <button
            onClick={() => testEndpoint(laptopService.getAll, 'GET /api/laptops')}
            className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            disabled={loading}
          >
            Get All Laptops
          </button>
        </div>

        {/* Assignment Endpoints */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Assignments</h2>
          <button
            onClick={() => testEndpoint(assignmentService.getAll, 'GET /api/assignments')}
            className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            disabled={loading}
          >
            Get All Assignments
          </button>
        </div>

        {/* Return Leasing Endpoints */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Return Leasing</h2>
          <button
            onClick={() => testEndpoint(returnLeasingService.getAll, 'GET /api/return-leasing')}
            className="w-full bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
            disabled={loading}
          >
            Get All Returns
          </button>
        </div>

        {/* Repair Endpoints */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Repairs</h2>
          <button
            onClick={() => testEndpoint(repairService.getAll, 'GET /api/repairs')}
            className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            disabled={loading}
          >
            Get All Repairs
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          Loading...
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Error: {error.label}</strong>
          <p>Status: {error.status || 'N/A'}</p>
          <p>Message: {error.message}</p>
        </div>
      )}

      {/* Success Display */}
      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <strong className="font-bold">Success: {result.label}</strong>
          <pre className="mt-2 bg-white p-3 rounded overflow-auto max-h-96">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-gray-100 p-4 rounded">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Click any button to test the corresponding API endpoint</li>
          <li>Check the browser console for detailed logs</li>
          <li>Green = Success, Red = Error (check status code)</li>
          <li>401 = Unauthorized (need to login/add token)</li>
          <li>403 = Forbidden (insufficient permissions)</li>
          <li>404 = Endpoint not found (check backend controller paths)</li>
        </ul>
      </div>
    </div>
  )
}
