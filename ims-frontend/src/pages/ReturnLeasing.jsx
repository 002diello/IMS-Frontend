import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Calendar, AlertTriangle } from 'lucide-react';
import api from '../api/client';

export default function ReturnLeasing() {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    number: '',
    csiAgreement: '',
    startExecutionDate: '',
    endDate: '',
    company: '',
    returnLaptop: '',
    serialNumber: '',
    pcId: '',
    remark: ''
  });

  const resetForm = () => {
    setFormData({
      number: '',
      csiAgreement: '',
      startExecutionDate: '',
      endDate: '',
      company: '',
      returnLaptop: '',
      serialNumber: '',
      pcId: '',
      remark: ''
    });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.number || !formData.csiAgreement || !formData.startExecutionDate || 
        !formData.endDate || !formData.company) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId) {
      setLeasings(leasings.map(leasing => 
        leasing.id === editingId ? { ...formData, id: editingId } : leasing
      ));
    } else {
      setLeasings([...leasings, { ...formData, id: Date.now() }]);
    }
    
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (leasing) => {
    setFormData(leasing);
    setEditingId(leasing.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this leasing record?')) {
      setLeasings(leasings.filter(leasing => leasing.id !== id));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Fetch laptops on component mount
  useEffect(() => {
    fetchLaptops();
  }, []);

  const fetchLaptops = async () => {
    try {
      setLoading(true);
      const response = await api.get('/laptops');
      setLaptops(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching laptops:', err);
      setError('Failed to load laptop data');
    } finally {
      setLoading(false);
    }
  };

  // Filter laptops with end date less than 3 months from now
  const getFilteredLaptops = () => {
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    return laptops.filter(laptop => {
      if (!laptop.endDate) return false;
      const endDate = new Date(laptop.endDate);
      return endDate <= threeMonthsFromNow;
    });
  };

  // Sort laptops: expired first, then active
  const getSortedLaptops = () => {
    const filteredLaptops = getFilteredLaptops();
    const today = new Date();

    return filteredLaptops.sort((a, b) => {
      const aEndDate = new Date(a.endDate);
      const bEndDate = new Date(b.endDate);

      const aIsExpired = aEndDate < today;
      const bIsExpired = bEndDate < today;

      // Expired laptops come first
      if (aIsExpired && !bIsExpired) return -1;
      if (!aIsExpired && bIsExpired) return 1;

      // Within same category, sort by end date (closest first)
      return aEndDate - bEndDate;
    });
  };

  // Apply search filter to sorted laptops
  const filteredLaptops = getSortedLaptops().filter(laptop =>
    Object.values(laptop).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Calculate stats
  const getLaptopStatus = (endDate) => {
    if (!endDate) return 'Unknown';
    const end = new Date(endDate);
    const today = new Date();
    return end < today ? 'Expired' : 'Active';
  };

  const activeLaptops = getFilteredLaptops().filter(l => getLaptopStatus(l.endDate) === 'Active').length;
  const expiredLaptops = getFilteredLaptops().filter(l => getLaptopStatus(l.endDate) === 'Expired').length;

  const getLeaseStatus = (endDate, returnDate) => {
    if (returnDate) return 'Returned';
    if (!endDate) return 'Active';
    const end = new Date(endDate);
    const today = new Date();
    if (end < today) return 'Expired';
    return 'Active';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Leasing Expiration Monitor</h2>
          <p className="text-gray-600 text-sm">Monitor laptops expiring within 3 months - expired first, then active</p>
        </div>
        <div className="flex items-center gap-2 text-orange-600">
          <AlertTriangle size={20} />
          <span className="text-sm font-medium">Urgent Action Required</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by PC ID, model, serial number, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total Expiring Soon</p>
          <p className="text-3xl font-bold text-blue-600">{getFilteredLaptops().length}</p>
          <p className="text-xs text-gray-500">Within 3 months</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Still Active</p>
          <p className="text-3xl font-bold text-green-600">{activeLaptops}</p>
          <p className="text-xs text-gray-500">End date not reached</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Already Expired</p>
          <p className="text-3xl font-bold text-red-600">{expiredLaptops}</p>
          <p className="text-xs text-gray-500">Require immediate action</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Days to Monitor</p>
          <p className="text-3xl font-bold text-orange-600">90</p>
          <p className="text-xs text-gray-500">3-month window</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PC ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CSI Agreement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Left</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="10" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      Loading laptops...
                    </div>
                  </td>
                </tr>
              ) : filteredLaptops.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-12 text-center text-gray-500">
                    No laptops expiring within 3 months found.
                  </td>
                </tr>
              ) : (
                filteredLaptops.map((laptop) => {
                  const status = getLaptopStatus(laptop.endDate);
                  const endDate = new Date(laptop.endDate);
                  const today = new Date();
                  const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

                  return (
                    <tr key={laptop.id} className={`hover:bg-gray-50 ${status === 'Expired' ? 'bg-red-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{laptop.pcId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{laptop.model}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{laptop.serialNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{laptop.csiAgreement}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{laptop.staffCompany || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{laptop.startDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{laptop.endDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          daysLeft < 0
                            ? 'bg-red-100 text-red-800'
                            : daysLeft <= 30
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          status === 'Expired'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => window.open(`/master-laptop?edit=${laptop.id}`, '_blank')}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="Edit in Master Laptop"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            const confirmMsg = status === 'Expired'
                              ? `This laptop is ${Math.abs(daysLeft)} days EXPIRED. Send for repair?`
                              : `This laptop expires in ${daysLeft} days. Send for repair?`;
                            if (window.confirm(confirmMsg)) {
                              // Navigate to repair record with laptop data
                              window.open(`/repair-record?laptop=${laptop.id}`, '_blank');
                            }
                          }}
                          className="text-orange-600 hover:text-orange-900"
                          title="Send to Repair"
                        >
                          <AlertTriangle size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
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
                {editingId ? 'Edit Leasing Record' : 'Add New Leasing'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number *</label>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    placeholder="e.g., LS-001"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CSI Agreement *</label>
                  <input
                    type="text"
                    name="csiAgreement"
                    value={formData.csiAgreement}
                    onChange={handleChange}
                    placeholder="e.g., CSI-2025-001"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Execution Date *</label>
                  <input
                    type="date"
                    name="startExecutionDate"
                    value={formData.startExecutionDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g., Tech Solutions Inc."
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Return Laptop Date</label>
                  <input
                    type="date"
                    name="returnLaptop"
                    value={formData.returnLaptop}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                  <input
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    placeholder="e.g., SN123456789"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PC ID</label>
                  <input
                    type="text"
                    name="pcId"
                    value={formData.pcId}
                    onChange={handleChange}
                    placeholder="e.g., PC-001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

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
                  {editingId ? 'Update' : 'Add'} Leasing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}