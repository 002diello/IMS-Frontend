import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, X, Wrench } from 'lucide-react';
import api from '../api/client';

export default function RepairRecord() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [repairs, setRepairs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    entity: '',
    date: '',
    model: '',
    serialNumber: '',
    pcId: '',
    partReplaced: '',
    po: '',
    remarks: '',
    status: 'Pending'
  });

  const resetForm = () => {
    setFormData({
      entity: '',
      date: '',
      model: '',
      serialNumber: '',
      pcId: '',
      partReplaced: '',
      po: '',
      remarks: '',
      status: 'Pending'
    });
    setEditingId(null);
  };

  // Fetch repairs on component mount
  useEffect(() => {
    fetchRepairs();
  }, []);

  // Check for laptop data from navigation state or URL parameter
  useEffect(() => {
    const handleLaptopData = async () => {
      // Handle location state (from Master Laptop)
      if (location.state?.laptopData) {
        const laptopData = location.state.laptopData;
        setFormData({
          entity: laptopData.entity || '',
          date: new Date().toISOString().split('T')[0], // Today's date
          model: laptopData.model || '',
          serialNumber: laptopData.serialNumber || '',
          pcId: laptopData.pcId || '',
          partReplaced: '',
          po: '',
          remarks: `Repair request for ${laptopData.model} (${laptopData.pcId})`,
          status: 'Pending'
        });
        setShowModal(true);
        return;
      }

      // Handle URL parameter (from Return Leasing)
      const laptopId = searchParams.get('laptop');
      if (laptopId) {
        try {
          setLoading(true);
          const response = await api.get(`/laptops/${laptopId}`);
          const laptop = response.data;
          
          setFormData({
            entity: laptop.staffCompany || 'IT Department',
            date: new Date().toISOString().split('T')[0], // Today's date
            model: laptop.model || '',
            serialNumber: laptop.serialNumber || '',
            pcId: laptop.pcId || '',
            partReplaced: '',
            po: '',
            remarks: `Repair request for ${laptop.model} (${laptop.pcId}) - Leasing expiration approaching`,
            status: 'Pending'
          });
          setShowModal(true);
        } catch (err) {
          console.error('Error fetching laptop data:', err);
          setError('Failed to load laptop data');
        } finally {
          setLoading(false);
        }
      }
    };

    handleLaptopData();
  }, [location.state, searchParams]);

  const fetchRepairs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/repairs');
      setRepairs(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching repairs:', err);
      setError('Failed to load repair records');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.entity || !formData.date || !formData.model || !formData.serialNumber || !formData.pcId) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editingId) {
        // Update existing repair
        await api.put(`/repairs/${editingId}`, formData);
      } else {
        // Create new repair
        await api.post('/repairs', formData);
      }
      
      // Refresh the list
      await fetchRepairs();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Error saving repair:', err);
      setError(err.response?.data?.message || 'Failed to save repair record');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (repair) => {
    setFormData(repair);
    setEditingId(repair.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this repair record?')) {
      try {
        setLoading(true);
        await api.delete(`/repairs/${id}`);
        await fetchRepairs();
        setError('');
      } catch (err) {
        console.error('Error deleting repair:', err);
        setError('Failed to delete repair record');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const filteredRepairs = repairs.filter(repair =>
    Object.values(repair).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const pendingCount = repairs.filter(r => r.status === 'Pending').length;
  const inProgressCount = repairs.filter(r => r.status === 'In Progress').length;
  const completedCount = repairs.filter(r => r.status === 'Completed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Repair Record Management</h2>
          <p className="text-gray-600 text-sm">Track and manage laptop repair records</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Repair Record
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by entity, model, PC ID, serial number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total Repairs</p>
          <p className="text-3xl font-bold text-blue-600">{repairs.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-3xl font-bold text-orange-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">In Progress</p>
          <p className="text-3xl font-bold text-yellow-600">{inProgressCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-3xl font-bold text-green-600">{completedCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PC ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Replaced</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRepairs.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                    No repair records found. Click Add Repair Record to get started.
                  </td>
                </tr>
              ) : (
                filteredRepairs.map((repair) => (
                  <tr key={repair.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{repair.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{repair.entity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{repair.model}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{repair.serialNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{repair.pcId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{repair.partReplaced || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{repair.po || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        repair.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : repair.status === 'In Progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {repair.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(repair)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(repair.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
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
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Wrench size={24} className="text-blue-600" />
                {editingId ? 'Edit Repair Record' : 'Add New Repair Record'}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Entity *</label>
                  <input
                    type="text"
                    name="entity"
                    value={formData.entity}
                    onChange={handleChange}
                    placeholder="e.g., IT Department"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="e.g., Dell Latitude 5420"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number *</label>
                  <input
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    placeholder="e.g., SN123456789"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PC ID *</label>
                  <input
                    type="text"
                    name="pcId"
                    value={formData.pcId}
                    onChange={handleChange}
                    placeholder="e.g., PC-001"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Part Replaced</label>
                  <input
                    type="text"
                    name="partReplaced"
                    value={formData.partReplaced}
                    onChange={handleChange}
                    placeholder="e.g., Battery, Screen, Keyboard"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PO (Purchase Order)</label>
                  <input
                    type="text"
                    name="po"
                    value={formData.po}
                    onChange={handleChange}
                    placeholder="e.g., PO-2025-001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Add any additional notes about the repair..."
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
                    setError('');
                  }}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : editingId ? 'Update' : 'Add'} Repair Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}