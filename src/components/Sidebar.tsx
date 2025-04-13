
import { useState } from 'react';
import { 
  Home, 
  Users, 
  Calendar, 
  MessageSquare, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Square
} from 'lucide-react';
import { cn } from '@/lib/utils';

type SidebarItemProps = {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick?: () => void;
  collapsed: boolean;
};

const SidebarItem = ({ icon, text, active = false, onClick, collapsed }: SidebarItemProps) => {
  return (
    <div 
      className={cn(
        "flex items-center p-3 my-1 cursor-pointer rounded-lg transition-all duration-200",
        active ? "bg-purple-700 text-white" : "text-gray-600 hover:bg-gray-100",
        collapsed ? "justify-center" : ""
      )}
      onClick={onClick}
    >
      <div className="w-5 h-5">{icon}</div>
      {!collapsed && <span className="ml-3 text-sm font-medium">{text}</span>}
    </div>
  );
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');

  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName);
  };

  return (
    <div 
      className={cn(
        "h-screen bg-white flex flex-col transition-all duration-300 border-r border-gray-200",
        collapsed ? "w-16" : "w-56"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center">
            <div className="h-8 w-8 border-2 border-purple-700 flex items-center justify-center">
              <Square size={16} className="text-purple-700" />
            </div>
            <span className="ml-2 font-bold text-purple-700">LOGO</span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        <div className={cn("mb-6", collapsed ? "mt-4" : "mt-2")}>
          {!collapsed && <p className="text-xs text-gray-500 mb-2 px-3">MAIN</p>}
          <SidebarItem 
            icon={<Home size={18} />} 
            text="Dashboard" 
            active={activeItem === 'Dashboard'} 
            onClick={() => handleItemClick('Dashboard')}
            collapsed={collapsed}
          />
          <SidebarItem 
            icon={<Users size={18} />} 
            text="Employees" 
            active={activeItem === 'Employees'} 
            onClick={() => handleItemClick('Employees')}
            collapsed={collapsed}
          />
          <SidebarItem 
            icon={<Calendar size={18} />} 
            text="Schedule" 
            active={activeItem === 'Schedule'} 
            onClick={() => handleItemClick('Schedule')}
            collapsed={collapsed}
          />
          <SidebarItem 
            icon={<MessageSquare size={18} />} 
            text="Messages" 
            active={activeItem === 'Messages'} 
            onClick={() => handleItemClick('Messages')}
            collapsed={collapsed}
          />
        </div>
        
        <div>
          {!collapsed && <p className="text-xs text-gray-500 mb-2 px-3">PREFERENCES</p>}
          <SidebarItem 
            icon={<Settings size={18} />} 
            text="Settings" 
            active={activeItem === 'Settings'} 
            onClick={() => handleItemClick('Settings')}
            collapsed={collapsed}
          />
        </div>
      </div>
      
      <div className="p-2 border-t border-gray-200">
        <SidebarItem 
          icon={<LogOut size={18} />} 
          text="Logout" 
          onClick={() => console.log('Logout clicked')}
          collapsed={collapsed}
        />
      </div>
    </div>
  );
};

export default Sidebar;
