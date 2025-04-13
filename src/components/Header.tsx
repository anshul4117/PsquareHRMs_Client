
import { Search, Bell, ChevronDown, Square } from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-600">Welcome back, John!</p>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input 
            type="text" 
            placeholder="Search..." 
            className="bg-gray-100 border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500 w-64"
          />
        </div>
        
        <div className="relative">
          <button className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
            <Bell size={18} className="text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-3 border-l border-gray-200 pl-4 focus:outline-none">
            <div className="h-10 w-10 rounded-full bg-purple-700 flex items-center justify-center">
              <span className="text-white font-medium">JD</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-800">John Doe</p>
              <p className="text-xs text-gray-500">HR Manager</p>
            </div>
            <ChevronDown size={16} className="text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white border border-gray-200">
            <DropdownMenuItem className="text-gray-800 hover:bg-gray-100 cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-800 hover:bg-gray-100 cursor-pointer">
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-gray-800 hover:bg-gray-100 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
