import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, X, Upload, Download, Wrench } from 'lucide-react';
import api from '../api/client';
import * as XLSX from 'xlsx';

export default function MasterLaptop() {
  const navigate = useNavigate();
  const [laptops, setLaptops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'available', 'assigned'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    csiAgreement: '',
    startDate: '',
    endDate: '',
    laptopEntity: '',
    model: '',
    serialNumber: '',
    pcId: '',
    lastRoutineStatus: '',
    currentRoutineStatus: '',
    staffCompany: '',
    employeeNo: '',
    joinDate: '',
    collectDate: '',
    lastWorkingDay: '',
    remark: ''
  });

  const resetForm = () => {
    setFormData({
      invoiceNumber: '',
      csiAgreement: '',
      startDate: '',
      endDate: '',
      laptopEntity: '',
      model: '',
      serialNumber: '',
      pcId: '',
      lastRoutineStatus: '',
      currentRoutineStatus: '',
      staffCompany: '',
      employeeNo: '',
      joinDate: '',
      collectDate: '',
      lastWorkingDay: '',
      remark: ''
    });
    setEditingId(null);
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
      setError('Failed to load laptops');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (editingId) {
        // Update existing laptop
        await api.put(`/laptops/${editingId}`, formData);
      } else {
        // Create new laptop
        await api.post('/laptops', formData);
      }
      
      // Refresh the list
      await fetchLaptops();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Error saving laptop:', err);
      setError(err.response?.data?.message || 'Failed to save laptop');
    } finally {
      setLoading(false);
    }
  };

  const handleRepair = async (laptop) => {
    if (window.confirm(`Send ${laptop.model} (${laptop.pcId}) for repair?`)) {
      try {
        setLoading(true);

        // Create repair record directly
        const repairData = {
          entity: laptop.staffCompany || 'IT Department',
          date: new Date().toISOString().split('T')[0], // Today's date
          model: laptop.model,
          serialNumber: laptop.serialNumber,
          pcId: laptop.pcId,
          partReplaced: '',
          po: '',
          remarks: `Repair initiated for ${laptop.model} (${laptop.pcId})`,
          status: 'Pending'
        };

        await api.post('/repairs', repairData);

        // Show success message
        alert(`Repair record created successfully!\n\nLaptop: ${laptop.model} (${laptop.pcId})\nStatus: Pending\n\nNavigate to Repair Record page to complete details.`);

        // Navigate to repair record page with laptop data for further editing
        navigate('/repair-record', {
          state: {
            laptopData: {
              model: laptop.model,
              serialNumber: laptop.serialNumber,
              pcId: laptop.pcId,
              entity: laptop.staffCompany || 'IT Department'
            }
          }
        });

      } catch (err) {
        console.error('Error creating repair record:', err);
        alert('Failed to create repair record. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (laptop) => {
    setFormData(laptop);
    setEditingId(laptop.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this laptop?')) {
      try {
        setLoading(true);
        await api.delete(`/laptops/${id}`);
        await fetchLaptops();
        setError('');
      } catch (err) {
        console.error('Error deleting laptop:', err);
        setError('Failed to delete laptop');
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

  // Convert d/m/yyyy or dd/mm/yyyy to yyyy-mm-dd
  const convertDateFormat = (dateStr) => {
    if (!dateStr) return '';
    
    // If already in yyyy-mm-dd format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    
    // Handle d/m/yyyy or dd/mm/yyyy format
    const parts = dateStr.toString().split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    
    // Handle Excel serial date number
    if (!isNaN(dateStr)) {
      const date = new Date((dateStr - 25569) * 86400 * 1000);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    return dateStr;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setUploadProgress('Reading file...');

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setUploadProgress(`Processing ${jsonData.length} rows...`);

      // Map Excel columns to database fields
      const laptopsToImport = jsonData.map(row => ({
        invoiceNumber: row['Invoice No'] || row['invoiceNumber'] || '',
        csiAgreement: row['CSI Agreement'] || row['csiAgreement'] || '',
        startDate: convertDateFormat(row['Start Date'] || row['startDate'] || ''),
        endDate: convertDateFormat(row['End Date'] || row['endDate'] || ''),
        laptopEntity: row['Laptop Entity'] || row['laptopEntity'] || '',
        model: row['Model'] || row['model'] || '',
        serialNumber: row['Serial No'] || row['serialNumber'] || '',
        pcId: row['PC ID'] || row['pcId'] || '',
        lastRoutineStatus: row['Last ROUTINE STATUS'] || row['lastRoutineStatus'] || '',
        currentRoutineStatus: row['Current ROUTINE STATUS'] || row['currentRoutineStatus'] || '',
        staffCompany: row['Staff Company'] || row['staffCompany'] || '',
        employeeNo: row['Employee No'] || row['employeeNo'] || '',
        joinDate: convertDateFormat(row['Join Date'] || row['joinDate'] || ''),
        collectDate: convertDateFormat(row['Collect Date'] || row['collectDate'] || ''),
        lastWorkingDay: convertDateFormat(row['Last Working Day'] || row['lastWorkingDay'] || ''),
        remark: row['Remark'] || row['remark'] || ''
      }));

      // Send to backend
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < laptopsToImport.length; i++) {
        try {
          setUploadProgress(`Uploading ${i + 1}/${laptopsToImport.length}...`);
          await api.post('/laptops', laptopsToImport[i]);
          successCount++;
        } catch (err) {
          console.error(`Failed to import row ${i + 1}:`, err);
          failCount++;
        }
      }

      // Refresh the list
      await fetchLaptops();
      setUploadProgress('');
      alert(`Import complete!\nSuccess: ${successCount}\nFailed: ${failCount}`);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Failed to process Excel file. Please check the format.');
      setUploadProgress('');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    // Create template Excel file
    const template = [
      {
        'Invoice No': 'INV-001',
        'CSI Agreement': 'CSI-AGR-001',
        'Start Date': '1/1/2024',
        'End Date': '31/12/2025',
        'Laptop Entity': 'Company Laptop',
        'Model': 'Dell Latitude 5420',
        'Serial No': 'SN123456789',
        'PC ID': 'PC-001',
        'Last ROUTINE STATUS': '',
        'Current ROUTINE STATUS': 'John Doe',
        'Staff Company': 'ABC Corporation',
        'Employee No': 'EMP001',
        'Join Date': '15/1/2024',
        'Collect Date': '20/1/2024',
        'Last Working Day': '',
        'Remark': 'Sample laptop entry'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    
    // Add instructions row at the top
    XLSX.utils.sheet_add_aoa(ws, [[
      'INSTRUCTIONS: Use date format d/m/yyyy (e.g., 1/1/2024 or 31/12/2025). Delete this row before uploading.'
    ]], { origin: 'A1' });
    
    // Shift data down by 1 row
    const range = XLSX.utils.decode_range(ws['!ref']);
    range.e.r++;
    ws['!ref'] = XLSX.utils.encode_range(range);
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laptops');
    XLSX.writeFile(wb, 'laptop_import_template.xlsx');
  };

  const filteredLaptops = laptops.filter(laptop => {
    // Search filter - safely handle null/undefined values
    const matchesSearch = searchTerm === '' || Object.values(laptop).some(value => {
      if (value === null || value === undefined) return false;
      return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    // Status filter
    let matchesStatus = true;
    if (filterStatus === 'available') {
      matchesStatus = !laptop.currentRoutineStatus || laptop.currentRoutineStatus === '';
    } else if (filterStatus === 'assigned') {
      matchesStatus = laptop.currentRoutineStatus && laptop.currentRoutineStatus !== '';
    }
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Laptop Inventory</h2>
          <p className="text-gray-600 text-sm">Manage all laptop records and specifications</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            title="Download Excel Template"
          >
            <Download size={20} />
            Download Template
          </button>
          <label className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">
            <Upload size={20} />
            Upload Excel
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              disabled={loading}
            />
          </label>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add New Laptop
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by any field..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({laptops.length})
          </button>
          <button
            onClick={() => setFilterStatus('available')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'available'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Available ({laptops.filter(l => !l.currentRoutineStatus || l.currentRoutineStatus === '').length})
          </button>
          <button
            onClick={() => setFilterStatus('assigned')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'assigned'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Assigned ({laptops.filter(l => l.currentRoutineStatus && l.currentRoutineStatus !== '').length})
          </button>
        </div>
      </div>

      {uploadProgress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="text-blue-700 font-medium">{uploadProgress}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total Laptops</p>
          <p className="text-3xl font-bold text-blue-600">{laptops.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">With Current Staff</p>
          <p className="text-3xl font-bold text-green-600">
            {laptops.filter(l => l.currentRoutineStatus).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Available</p>
          <p className="text-3xl font-bold text-gray-600">
            {laptops.filter(l => !l.currentRoutineStatus).length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PC ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Staff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Working Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLaptops.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    No laptops found. Click Add New Laptop to get started.
                  </td>
                </tr>
              ) : (
                filteredLaptops.map((laptop) => (
                  <tr key={laptop.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{laptop.pcId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{laptop.model}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{laptop.endDate || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{laptop.serialNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {laptop.currentRoutineStatus ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {laptop.currentRoutineStatus}
                        </span>
                      ) : (
                        <span className="text-gray-400">Available</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{laptop.staffCompany || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{laptop.lastWorkingDay || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(laptop)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleRepair(laptop)}
                        className="text-orange-600 hover:text-orange-900 mr-3"
                        title="Send to Repair"
                      >
                        <Wrench size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(laptop.id)}
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">
                {editingId ? 'Edit Laptop' : 'Add New Laptop'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                  setError('');
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number *</label>
                  <input
                    type="text"
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={handleChange}
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
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Laptop Entity *</label>
                  <input
                    type="text"
                    name="laptopEntity"
                    value={formData.laptopEntity}
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
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last ROUTINE STATUS (Staff Name)</label>
                  <input
                    type="text"
                    name="lastRoutineStatus"
                    value={formData.lastRoutineStatus}
                    onChange={handleChange}
                    placeholder="e.g., John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current ROUTINE STATUS (Staff Name)</label>
                  <input
                    type="text"
                    name="currentRoutineStatus"
                    value={formData.currentRoutineStatus}
                    onChange={handleChange}
                    placeholder="e.g., Jane Smith"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Staff Company</label>
                  <input
                    type="text"
                    name="staffCompany"
                    value={formData.staffCompany}
                    onChange={handleChange}
                    placeholder="e.g., ABC Corporation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee No</label>
                  <input
                    type="text"
                    name="employeeNo"
                    value={formData.employeeNo}
                    onChange={handleChange}
                    placeholder="e.g., EMP001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                  <input
                    type="date"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Collect Date</label>
                  <input
                    type="date"
                    name="collectDate"
                    value={formData.collectDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Working Day</label>
                  <input
                    type="date"
                    name="lastWorkingDay"
                    value={formData.lastWorkingDay}
                    onChange={handleChange}
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
                  {loading ? 'Saving...' : editingId ? 'Update Laptop' : 'Add Laptop'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}