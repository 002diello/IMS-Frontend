// import { useState } from "react";
// import { BrowserRouter as Router } from "react-router-dom";
// import { Laptop, Undo2, RotateCcw, Wrench } from "lucide-react";
// import Sidebar from "./components/Sidebar";

// export default function App() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [activeModule, setActiveModule] = useState("master");

//   const modules = [
//     {
//       id: "master",
//       label: "Master Laptop",
//       icon: Laptop,
//       description: "Manage laptop inventory and specifications",
//     },
//     {
//       id: "assign",
//       label: "Assign & Return",
//       icon: Undo2,
//       description: "Handle laptop assignments and returns",
//     },
//     {
//       id: "leasing",
//       label: "Return Leasing",
//       icon: RotateCcw,
//       description: "Manage leasing returns and agreements",
//     },
//     {
//       id: "repair",
//       label: "Repair Record",
//       icon: Wrench,
//       description: "Track and manage repair records",
//     },
//   ];

//   const currentModule = modules.find((m) => m.id === activeModule);
//   const CurrentIcon = currentModule.icon;

//   return (
//     <Router>
//       {/* ✅ Fullscreen container */}
//       <div className="flex flex-col w-screen h-screen overflow-hidden bg-gray-50">
//         <div className="flex flex-1 overflow-hidden">
//           {/* ✅ Sidebar */}
//           <Sidebar
//             setActiveModule={setActiveModule}
//             activeModule={activeModule}
//             sidebarOpen={sidebarOpen}
//             setSidebarOpen={setSidebarOpen}
//           />

//           {/* ✅ Main content */}
//           <main className="flex-1 flex flex-col overflow-hidden">
//             {/* Header */}
//             <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
//               <div className="flex items-center justify-between px-6 py-4">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-blue-100 rounded-lg">
//                     <CurrentIcon size={26} className="text-blue-600" />
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-semibold text-gray-800">
//                       {currentModule.label}
//                     </h2>
//                     <p className="text-gray-500 text-sm">
//                       {currentModule.description}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-gray-500 text-sm">Welcome, Admin</p>
//                   <p className="text-gray-700 font-medium">Inventory Dashboard</p>
//                 </div>
//               </div>
//             </header>

//             {/* ✅ Scrollable Content Area */}
//             <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-full">
//                 {/* Main module area */}
//                 <div className="lg:col-span-2 bg-white rounded-lg shadow p-8 flex flex-col">
//                   <div className="flex items-start justify-between mb-6">
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                         {currentModule.label}
//                       </h3>
//                       <p className="text-gray-600">
//                         {currentModule.description}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex-1 bg-gray-50 rounded p-6 border border-gray-200 flex items-center justify-center">
//                     <div className="text-center">
//                       <CurrentIcon
//                         size={64}
//                         className="text-gray-300 mx-auto mb-4"
//                       />
//                       <p className="text-gray-500 font-medium">
//                         {currentModule.label} Module
//                       </p>
//                       <p className="text-gray-400 text-sm mt-1">
//                         Content will be displayed here
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Quick Stats */}
//                 <div className="bg-white rounded-lg shadow p-6">
//                   <h4 className="font-semibold text-gray-800 mb-4">
//                     Quick Stats
//                   </h4>
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
//                       <span className="text-gray-600">Total Items</span>
//                       <span className="text-2xl font-bold text-blue-600">0</span>
//                     </div>
//                     <div className="flex justify-between items-center p-3 bg-green-50 rounded">
//                       <span className="text-gray-600">Active</span>
//                       <span className="text-2xl font-bold text-green-600">0</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Recent Activity */}
//                 <div className="bg-white rounded-lg shadow p-6 lg:col-span-3">
//                   <h4 className="font-semibold text-gray-800 mb-4">
//                     Recent Activity
//                   </h4>
//                   <div className="text-center py-8 text-gray-400">
//                     <p>No recent activity</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </main>
//         </div>
//       </div>
//     </Router>
//   );
// }




// import { useState } from "react";
// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import { LayoutDashboard, Laptop, Undo2, RotateCcw, Wrench } from "lucide-react";
// import Sidebar from "./components/Sidebar";
// import Dashboard from "./pages/Dashboard";
// import MasterLaptop from "./pages/MasterLaptop";
// import AssignReturn from "./pages/AssignReturn";
// import ReturnLeasing from "./pages/ReturnLeasing";
// import RepairRecord from "./pages/RepairRecord";

// // Module configuration
// const modules = {
//   "/": {
//     label: "Dashboard",
//     icon: LayoutDashboard,
//     description: "Overview of inventory statistics",
//   },
//   "/master-laptop": {
//     label: "Master Laptop",
//     icon: Laptop,
//     description: "Manage laptop inventory and specifications",
//   },
//   "/assign-return": {
//     label: "Assign & Return",
//     icon: Undo2,
//     description: "Handle laptop assignments and returns",
//   },
//   "/return-leasing": {
//     label: "Return Leasing",
//     icon: RotateCcw,
//     description: "Manage leasing returns and agreements",
//   },
//   "/repair-record": {
//     label: "Repair Record",
//     icon: Wrench,
//     description: "Track and manage repair records",
//   },
// };

// // Layout component that uses useLocation
// function AppLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const location = useLocation();
  
//   const currentModule = modules[location.pathname] || modules["/"];
//   const CurrentIcon = currentModule.icon;

//   return (
//     <div className="flex w-screen h-screen overflow-hidden bg-gray-50">
//       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//       <main className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
//           <div className="flex items-center justify-between px-6 py-4">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <CurrentIcon size={26} className="text-blue-600" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-800">
//                   {currentModule.label}
//                 </h2>
//                 <p className="text-gray-500 text-sm">
//                   {currentModule.description}
//                 </p>
//               </div>
//             </div>
//             <div className="text-right">
//               <p className="text-gray-500 text-sm">Welcome, Admin</p>
//               <p className="text-gray-700 font-medium">Inventory Dashboard</p>
//             </div>
//           </div>
//         </header>

//         {/* Scrollable Content Area */}
//         <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
//           <Routes>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/master-laptop" element={<MasterLaptop />} />
//             <Route path="/assign-return" element={<AssignReturn />} />
//             <Route path="/return-leasing" element={<ReturnLeasing />} />
//             <Route path="/repair-record" element={<RepairRecord />} />
//           </Routes>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <Router>
//       <AppLayout />
//     </Router>
//   );
// }

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { LayoutDashboard, Laptop, Undo2, RotateCcw, Wrench, User, LogOut, ChevronDown } from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import MasterLaptop from "./pages/MasterLaptop";
import AssignReturn from "./pages/AssignReturn";
import ReturnLeasing from "./pages/ReturnLeasing";
import RepairRecord from "./pages/RepairRecord";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ApiTest from "./pages/ApiTest";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

const modules = {
  "/": {
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview of inventory statistics",
  },
  "/master-laptop": {
    label: "Master Laptop",
    icon: Laptop,
    description: "Manage laptop inventory and specifications",
  },
  "/assign-return": {
    label: "Assign & Return",
    icon: Undo2,
    description: "Handle laptop assignments and returns",
  },
  "/return-leasing": {
    label: "Return Leasing",
    icon: RotateCcw,
    description: "Manage leasing returns and agreements",
  },
  "/repair-record": {
    label: "Repair Record",
    icon: Wrench,
    description: "Track and manage repair records",
  },
  "/profile": {
    label: "My Profile",
    icon: User,
    description: "Manage your account settings",
  },
  "/api-test": {
    label: "API Test",
    icon: Wrench,
    description: "Test API endpoints",
  },
};

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const currentModule = modules[location.pathname] || modules["/"];
  const CurrentIcon = currentModule.icon;
  const userName = user?.name || user?.fullName || user?.email || 'User';
  const userEmail = user?.email || 'user@company.com';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CurrentIcon size={26} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {currentModule.label}
                </h2>
                <p className="text-gray-500 text-sm">
                  {currentModule.description}
                </p>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
              >
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{userName}</p>
                  <p className="text-xs text-gray-500">{userEmail}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={20} className="text-blue-600" />
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User size={18} />
                      My Profile
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/master-laptop" element={<MasterLaptop />} />
            <Route path="/assign-return" element={<AssignReturn />} />
            <Route path="/return-leasing" element={<ReturnLeasing />} />
            <Route path="/repair-record" element={<RepairRecord />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/api-test" element={<ApiTest />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}