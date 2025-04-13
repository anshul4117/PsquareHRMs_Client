
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  Users, 
  BarChart2, 
  FileText, 
  LogOut,
  Mail,
  Bell,
  Square
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SidebarItemProps = {
  icon: React.ReactNode;
  text: string;
  active: boolean;
  to: string;
};

const SidebarItem = ({ icon, text, active, to }: SidebarItemProps) => {
  return (
    <Link 
      to={to}
      className={`flex items-center p-3 my-1 cursor-pointer rounded-lg transition-all duration-200 ${
        active ? "bg-purple-700 text-white" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="ml-3 text-sm font-medium">{text}</span>
    </Link>
  );
};

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const pathname = location.pathname;

  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard';
    if (pathname === '/candidates') return 'Candidates';
    if (pathname === '/employees') return 'Employees';
    if (pathname === '/attendance') return 'Attendance';
    if (pathname === '/leaves') return 'Leaves';
    return 'Dashboard';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="h-screen bg-white flex flex-col transition-all duration-300 border-r border-gray-200 w-56">
        <div className="flex items-center justify-start p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 border-2 border-purple-700 flex items-center justify-center">
              <Square size={16} className="text-purple-700" />
            </div>
            <span className="ml-2 font-bold text-purple-700">LOGO</span>
          </div>
        </div>
        
        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <Input 
              type="text" 
              placeholder="Search..." 
              className="bg-gray-100 border-gray-200 pl-10 pr-4 py-2 rounded-lg text-sm text-gray-600 focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>
        
        {/* Menu sections */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          <div className="mb-6">
            <p className="text-xs text-gray-500 mb-2 px-3">Recruitment</p>
            <SidebarItem 
              icon={<Users size={18} />} 
              text="Candidates" 
              active={pathname === '/api/candidates'}
              to="/api/candidates"
            />
          </div>
          
          <div className="mb-6">
            <p className="text-xs text-gray-500 mb-2 px-3">Organization</p>
            <SidebarItem 
              icon={<Users size={18} />} 
              text="Employees" 
              active={pathname === '/api/employees'}
              to="/api/employees"
            />
            <SidebarItem 
              icon={<BarChart2 size={18} />} 
              text="Attendance" 
              active={pathname === '/api/attendance'}
              to="/api/attendance"
            />
            <SidebarItem 
              icon={<FileText size={18} />} 
              text="Leaves" 
              active={pathname === '/api/leaves'}
              to="/api/leaves"
            />
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-2 px-3">Others</p>
            <SidebarItem 
              icon={<LogOut size={18} />} 
              text="Logout" 
              active={false}
              to="/logout"
            />
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 h-screen flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input 
                type="text" 
                placeholder="Search..." 
                className="bg-gray-100 border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 w-64"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Mail size={20} className="text-gray-600" />
              </button>
              
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
                <div className="h-10 w-10 rounded-full bg-purple-700 flex items-center justify-center">
                  <span className="text-white font-medium">JD</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800">John Doe</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
