import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X, Calendar } from 'lucide-react';

export default function ReturnLeasing() {
  const [leasings, setLeasings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredLeasings = leasings.filter(leasing =>
    Object.values(leasing).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const activeLeasings = leasings.filter(l => {
    if (!l.endDate) return false;
    const endDate = new Date(l.endDate);
    const today = new Date();
    return endDate >= today;
  }).length;

  const expiredLeasings = leasings.filter(l => {
    if (!l.endDate) return false;
    const endDate = new Date(l.endDate);
    const today = new Date();
    return endDate < today;
  }).length;

  const returnedCount = leasings.filter(l => l.returnLaptop).length;

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
          <h2 className="text-2xl font-bold text-gray-800">Return Leasing Management</h2>
          <p className="text-gray-600 text-sm">Manage laptop leasing agreements and returns</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add New Leasing
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by number, CSI agreement, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total Leasings</p>
          <p className="text-3xl font-bold text-blue-600">{leasings.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Active</p>
          <p className="text-3xl font-bold text-green-600">{activeLeasings}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Expired</p>
          <p className="text-3xl font-bold text-red-600">{expiredLeasings}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Returned</p>
          <p className="text-3xl font-bold text-gray-600">{returnedCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CSI Agreement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PC ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeasings.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-6 py-12 text-center text-gray-500">
                    No leasing records found. Click Add New Leasing to get started.
                  </td>
                </tr>
              ) : (
                filteredLeasings.map((leasing) => {
                  const status = getLeaseStatus(leasing.endDate, leasing.returnLaptop);
                  return (
                    <tr key={leasing.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leasing.number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leasing.csiAgreement}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leasing.company}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leasing.pcId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leasing.serialNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leasing.startExecutionDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leasing.endDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {leasing.returnLaptop || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : status === 'Returned'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(leasing)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(leasing.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 size={18} />
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