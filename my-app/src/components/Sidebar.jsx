// import React from "react";
// import { NavLink } from "react-router-dom";
// import {
//   FaLaptop,
//   FaClipboardList,
//   FaUndo,
//   FaWrench,
//   FaBars,
//   FaTimes,
//   FaTachometerAlt,
// } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";

// const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
//   const menuItems = [
//     { path: "/", name: "Dashboard", icon: <FaTachometerAlt /> },
//     { path: "/master-laptop", name: "Master Laptop", icon: <FaLaptop /> },
//     { path: "/assign-return", name: "Assign & Return", icon: <FaClipboardList /> },
//     { path: "/return-leasing", name: "Return Leasing", icon: <FaUndo /> },
//     { path: "/repair-record", name: "Repair Record", icon: <FaWrench /> },
//   ];

//   return (
//     <>
//       {/* Sidebar */}
//       <motion.aside
//         animate={{ width: sidebarOpen ? 260 : 80 }}
//         transition={{ duration: 0.3, ease: "easeInOut" }}
//         className="bg-gradient-to-b from-blue-700 to-blue-900 text-white flex flex-col h-full shadow-2xl flex-shrink-0 overflow-hidden"
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between px-4 py-5 border-b border-blue-600">
//           <AnimatePresence>
//             {sidebarOpen && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="flex items-center gap-2"
//               >
//                 <div className="bg-blue-500 rounded-lg p-1.5">
//                   <FaLaptop className="text-white text-lg" />
//                 </div>
//                 <h1 className="text-lg font-bold">IMS Dashboard</h1>
//               </motion.div>
//             )}
//           </AnimatePresence>
//           <button
//             className="text-white text-xl hover:bg-blue-600 p-2 rounded-md transition-colors duration-200 focus:outline-none"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             aria-label="Toggle sidebar"
//           >
//             {sidebarOpen ? <FaTimes /> : <FaBars />}
//           </button>
//         </div>

//         {/* Menu */}
//         <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
//           {menuItems.map((item, index) => (
//             <NavLink
//               to={item.path}
//               key={index}
//               className={({ isActive }) =>
//                 `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group ${
//                   isActive
//                     ? "bg-blue-600 font-semibold shadow-md border-l-4 border-blue-400"
//                     : "hover:bg-blue-600"
//                 }`
//               }
//             >
//               <span className="text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
//                 {item.icon}
//               </span>
//               <AnimatePresence>
//                 {sidebarOpen && (
//                   <motion.span
//                     initial={{ opacity: 0, width: 0 }}
//                     animate={{ opacity: 1, width: "auto" }}
//                     exit={{ opacity: 0, width: 0 }}
//                     transition={{ duration: 0.2 }}
//                     className="whitespace-nowrap text-sm font-medium"
//                   >
//                     {item.name}
//                   </motion.span>
//                 )}
//               </AnimatePresence>
//             </NavLink>
//           ))}
//         </nav>

//         {/* Footer */}
//         <div className="border-t border-blue-600 p-4">
//           <motion.div
//             animate={{ opacity: sidebarOpen ? 1 : 0 }}
//             transition={{ duration: 0.2 }}
//             className={sidebarOpen ? "block" : "hidden"}
//           >
//             <p className="text-xs text-blue-200 text-center">
//               Inventory Management System
//             </p>
//           </motion.div>
//         </div>
//       </motion.aside>
//     </>
//   );
// };

// export default Sidebar;

//new
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaLaptop,
  FaClipboardList,
  FaUndo,
  FaWrench,
  FaBars,
  FaTimes,
  FaTachometerAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    { path: "/", name: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/master-laptop", name: "Master Laptop", icon: <FaLaptop /> },
    { path: "/assign-return", name: "Assign & Return", icon: <FaClipboardList /> },
    { path: "/return-leasing", name: "Return Leasing", icon: <FaUndo /> },
    { path: "/repair-record", name: "Repair Record", icon: <FaWrench /> },
  ];

  const isSidebarExpanded = sidebarOpen || isHovered;

  return (
    <motion.aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ width: isSidebarExpanded ? 260 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-gradient-to-b from-blue-700 to-blue-900 text-white flex flex-col h-full shadow-2xl flex-shrink-0 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-blue-600">
        <AnimatePresence>
          {isSidebarExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <div className="bg-blue-500 rounded-lg p-1.5">
              <img src="/silverlake.png" alt="Silverlake Logo" className="w-19 h-10" />
              </div>
              <h1 className="text-lg font-bold">IMS</h1>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          className="bg-blue-600 text-xl text-white p-2 rounded-md transition-colors duration-200 focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-blue-600 font-semibold shadow-md border-l-4 border-blue-400 text-white"
                  : "hover:bg-blue-600 "
              }`
            }
          >
            <span className="text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
              {item.icon}
            </span>
            <AnimatePresence>
              {isSidebarExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap text-sm font-medium"
                >
                  {item.name}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-blue-600 p-4">
        <motion.div
          animate={{ opacity: isSidebarExpanded ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className={isSidebarExpanded ? "block" : "hidden"}
        >
          <p className="text-xs text-blue-200 text-center">
            Inventory Management System
          </p>
        </motion.div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
