import { useState, useEffect } from 'react';
import { Plus, Edit2, CheckCircle, Search, X, UserPlus, RotateCcw } from 'lucide-react';
import api from '../api/client';

export default function AssignReturn() {
  const [assignments, setAssignments] = useState([]);
  const [availableLaptops, setAvailableLaptops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    staffEntity: '',
    pcId: '',
    serialNumber: '',
    userName: '',
    remark: '',
    employeeId: '',
    email: '',
    masterLaptop: null,  // Will store the full laptop object
    status: 'Assigned'
  });

  // Fetch assignments and available laptops on mount
  useEffect(() => {
    fetchAssignments();
    fetchAvailableLaptops();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/assignments');
      setAssignments(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableLaptops = async () => {
    try {
      const response = await api.get('/laptops');
      // Filter laptops that have current staff (for display in table)
      const assigned = response.data.filter(l => l.currentRoutineStatus && l.currentRoutineStatus !== '');
      // Filter laptops that are available (for assignment dropdown)
      const available = response.data.filter(l => !l.currentRoutineStatus || l.currentRoutineStatus === '');
      setAvailableLaptops(available);
    } catch (err) {
      console.error('Error fetching laptops:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      staffEntity: '',
      pcId: '',
      serialNumber: '',
      userName: '',
      remark: '',
      employeeId: '',
      email: '',
      masterLaptop: null,
      status: 'Assigned'
    });
    setEditingId(null);
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.staffEntity || !formData.userName || !formData.employeeId || !formData.email || !formData.masterLaptop) {
      setError('Please fill in all required fields and select a laptop');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editingId) {
        await api.put(`/assignments/${editingId}`, formData);
      } else {
        await api.post('/assignments', formData);
      }
      
      await fetchAssignments();
      await fetchAvailableLaptops();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Error saving assignment:', err);
      setError(err.response?.data?.message || 'Failed to save assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (assignment) => {
    setFormData(assignment);
    setEditingId(assignment.id);
    setShowModal(true);
  };

  const handleReturn = async (id) => {
    if (window.confirm('Mark this laptop as returned? This will make the laptop available for new assignments.')) {
      setLoading(true);
      try {
        await api.put(`/assignments/${id}/return`);
        await fetchAssignments();
        await fetchAvailableLaptops();
        setError('');
      } catch (err) {
        console.error('Error returning laptop:', err);
        setError('Failed to return laptop');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLaptopSelect = (e) => {
    const laptopId = e.target.value;
    if (laptopId) {
      const laptop = availableLaptops.find(l => l.id === parseInt(laptopId));
      if (laptop) {
        setFormData({
          ...formData,
          masterLaptop: laptop,  // Store full laptop object
          pcId: laptop.pcId,
          serialNumber: laptop.serialNumber
        });
      }
    } else {
      setFormData({
        ...formData,
        masterLaptop: null,
        pcId: '',
        serialNumber: ''
      });
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (searchTerm === '') return true;
    return Object.values(assignment).some(value => {
      if (value === null || value === undefined) return false;
      return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const activeAssignments = assignments.filter(a => a.status === 'Assigned').length;
  const returnedAssignments = assignments.filter(a => a.status === 'Returned').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Assign & Return Management</h2>
          <p className="text-gray-600 text-sm">Track laptop assignments and returns</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus size={20} />
          Assign Laptop
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, employee ID, PC ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total Assignments</p>
          <p className="text-3xl font-bold text-blue-600">{assignments.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Active Assignments</p>
          <p className="text-3xl font-bold text-green-600">{activeAssignments}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Returned</p>
          <p className="text-3xl font-bold text-gray-600">{returnedAssignments}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PC ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returned At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Entity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan="14" className="px-6 py-12 text-center text-gray-500">
                    No assignments found. Click Assign Laptop to get started.
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assignment.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assignment.assignedAt || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assignment.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assignment.employeeId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assignment.model || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assignment.pcId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assignment.remark || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assignment.returnedAt || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assignment.serialNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assignment.staffEntity || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        assignment.status === 'Assigned' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assignment.userName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(assignment)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      {assignment.status === 'Assigned' && (
                        <button
                          onClick={() => handleReturn(assignment.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Mark as Returned"
                        >
                          <RotateCcw size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                {editingId ? 'Edit Assignment' : 'Assign Laptop to Staff'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!editingId && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Available Laptop *</label>
                    <select
                      onChange={handleLaptopSelect}
                      value={formData.masterLaptop?.id || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">-- Select a laptop --</option>
                      {availableLaptops.map(laptop => (
                        <option key={laptop.id} value={laptop.id}>
                          {laptop.pcId} - {laptop.model} ({laptop.serialNumber})
                        </option>
                      ))}
                    </select>
                    {availableLaptops.length === 0 && (
                      <p className="mt-1 text-sm text-orange-600">No available laptops. All laptops are currently assigned.</p>
                    )}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PC ID</label>
                  <input
                    type="text"
                    name="pcId"
                    value={formData.pcId}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                  <input
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Staff Entity *</label>
                  <input
                    type="text"
                    name="staffEntity"
                    value={formData.staffEntity}
                    onChange={handleChange}
                    placeholder="e.g., IT Department"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="e.g., EMP001"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User Name *</label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    placeholder="e.g., John Doe"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g., john@company.com"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {editingId && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Assigned">Assigned</option>
                        <option value="Returned">Returned</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
                  <textarea
                    name="remark"
                    value={formData.remark}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Add any additional notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingId ? 'Update' : 'Assign'} Laptop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}