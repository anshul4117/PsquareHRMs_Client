
import { 
  ArrowUp, 
  ArrowDown, 
  Users, 
  UserMinus, 
  UserPlus,
  BarChart 
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data for charts
const employeeData = [
  { month: 'Jan', count: 220 },
  { month: 'Feb', count: 240 },
  { month: 'Mar', count: 255 },
  { month: 'Apr', count: 245 },
  { month: 'May', count: 260 },
  { month: 'Jun', count: 270 },
  { month: 'Jul', count: 285 }
];

const attendanceData = [
  { month: 'Jan', attendance: 92 },
  { month: 'Feb', attendance: 89 },
  { month: 'Mar', attendance: 95 },
  { month: 'Apr', attendance: 91 },
  { month: 'May', attendance: 93 },
  { month: 'Jun', attendance: 96 },
  { month: 'Jul', attendance: 94 }
];

type StatCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: {
    value: string;
    type: 'increase' | 'decrease';
  };
  className?: string;
};

const StatCard = ({ title, value, icon, change, className }: StatCardProps) => {
  return (
    <div className={`bg-hrms-darkblue rounded-xl p-4 flex flex-col h-full ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-hrms-gray">{title}</h3>
        <div className="p-2 rounded-lg bg-hrms-dark text-hrms-purple">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold mb-2">{value}</p>
      {change && (
        <div className="flex items-center">
          {change.type === 'increase' ? (
            <ArrowUp size={14} className="text-green-500 mr-1" />
          ) : (
            <ArrowDown size={14} className="text-red-500 mr-1" />
          )}
          <span className={`text-xs font-medium ${change.type === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
            {change.value} from previous month
          </span>
        </div>
      )}
    </div>
  );
};

const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Total Employees" 
        value="285" 
        icon={<Users size={18} />} 
        change={{ value: "15 (5.6%)", type: "increase" }}
      />
      <StatCard 
        title="New Employees" 
        value="16" 
        icon={<UserPlus size={18} />} 
        change={{ value: "3 (23.1%)", type: "increase" }}
      />
      <StatCard 
        title="Resignations" 
        value="5" 
        icon={<UserMinus size={18} />} 
        change={{ value: "1 (16.7%)", type: "decrease" }}
      />
      <StatCard 
        title="Attendance Rate" 
        value="94%" 
        icon={<BarChart size={18} />} 
        change={{ value: "2%", type: "increase" }}
      />

      {/* Charts */}
      <div className="col-span-1 md:col-span-2 bg-hrms-darkblue rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-hrms-gray">Employee Growth</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-xs bg-hrms-purple rounded-lg">Monthly</button>
            <button className="px-3 py-1 text-xs bg-hrms-dark text-hrms-gray rounded-lg">Yearly</button>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={employeeData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
              <XAxis dataKey="month" tick={{ fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#0F172A',
                  border: '1px solid #1E293B',
                  borderRadius: '8px',
                  color: '#F8FAFC'
                }}
              />
              <Area type="monotone" dataKey="count" stroke="#7C3AED" fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 bg-hrms-darkblue rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-hrms-gray">Attendance Rate</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-xs bg-hrms-purple rounded-lg">Monthly</button>
            <button className="px-3 py-1 text-xs bg-hrms-dark text-hrms-gray rounded-lg">Yearly</button>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
              <XAxis dataKey="month" tick={{ fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#0F172A',
                  border: '1px solid #1E293B',
                  borderRadius: '8px',
                  color: '#F8FAFC'
                }}
              />
              <Line type="monotone" dataKey="attendance" stroke="#7C3AED" strokeWidth={2} dot={{ fill: '#7C3AED', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
