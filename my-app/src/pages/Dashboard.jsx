import { useState } from 'react';
import { Laptop, Users, PackageOpen, CheckCircle, XCircle, TrendingUp, Activity } from 'lucide-react';

export default function Dashboard() {
  // Mock data - replace with real data from your backend
  const [stats] = useState({
    totalLaptops: 50,
    assignedLaptops: 35,
    unassignedLaptops: 15,
    activeUsers: 35,
    inRepair: 3,
    availableForAssignment: 12
  });

  const statCards = [
    {
      title: 'Total Laptops',
      value: stats.totalLaptops,
      icon: Laptop,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: 'Total devices in inventory'
    },
    {
      title: 'Assigned Laptops',
      value: stats.assignedLaptops,
      icon: CheckCircle,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600',
      description: 'Currently in use'
    },
    {
      title: 'Unassigned Laptops',
      value: stats.unassignedLaptops,
      icon: PackageOpen,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      description: 'Available for assignment'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: Users,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      description: 'Users with assigned laptops'
    },
    {
      title: 'In Repair',
      value: stats.inRepair,
      icon: XCircle,
      color: 'bg-red-500',
      lightColor: 'bg-red-50',
      textColor: 'text-red-600',
      description: 'Laptops under maintenance'
    },
    {
      title: 'Available Stock',
      value: stats.availableForAssignment,
      icon: TrendingUp,
      color: 'bg-teal-500',
      lightColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      description: 'Ready to assign'
    }
  ];

  const utilizationRate = ((stats.assignedLaptops / stats.totalLaptops) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to IMS Dashboard</h1>
            <p className="text-blue-100">Monitor your laptop inventory at a glance</p>
          </div>
          <Activity size={48} className="opacity-50" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.lightColor} p-3 rounded-lg`}>
                  <Icon size={28} className={stat.textColor} />
                </div>
                <span className={`${stat.color} text-white text-xs font-semibold px-2 py-1 rounded-full`}>
                  Live
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</p>
              <p className="text-gray-500 text-xs">{stat.description}</p>
            </div>
          );
        })}
      </div>

      {/* Utilization Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilization Rate */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Laptop Utilization Rate</h3>
          <div className="flex items-center justify-center py-8">
            <div className="relative">
              <svg className="transform -rotate-90" width="180" height="180">
                <circle
                  cx="90"
                  cy="90"
                  r="70"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="90"
                  cy="90"
                  r="70"
                  stroke="#3b82f6"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - utilizationRate / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-800">{utilizationRate}%</span>
                <span className="text-sm text-gray-500">Utilized</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-green-50 rounded">
              <p className="text-2xl font-bold text-green-600">{stats.assignedLaptops}</p>
              <p className="text-xs text-gray-600">Assigned</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded">
              <p className="text-2xl font-bold text-orange-600">{stats.unassignedLaptops}</p>
              <p className="text-xs text-gray-600">Unassigned</p>
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Inventory Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded">
                  <Laptop size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Total Inventory</p>
                  <p className="text-xs text-gray-500">All laptops in system</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.totalLaptops}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded">
                  <Users size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Active Assignments</p>
                  <p className="text-xs text-gray-500">Users with laptops</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.activeUsers}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded">
                  <PackageOpen size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Ready to Assign</p>
                  <p className="text-xs text-gray-500">Available laptops</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.availableForAssignment}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded">
                  <XCircle size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Under Repair</p>
                  <p className="text-xs text-gray-500">Maintenance needed</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-800">{stats.inRepair}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Alert */}
      {stats.unassignedLaptops > 10 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <div className="flex items-center gap-3">
            <PackageOpen className="text-orange-500" size={24} />
            <div>
              <p className="font-semibold text-orange-800">High Unassigned Inventory</p>
              <p className="text-sm text-orange-700">
                You have {stats.unassignedLaptops} laptops available for assignment
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}