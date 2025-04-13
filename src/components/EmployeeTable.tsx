
import { Search, ChevronDown, MoreHorizontal } from 'lucide-react';

// Sample employee data
const employees = [
  {
    id: 1,
    name: 'Sarah Johnson',
    position: 'UX Designer',
    department: 'Design',
    status: 'Active',
    joinDate: 'Jan 10, 2023',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: 2,
    name: 'Michael Chen',
    position: 'Frontend Developer',
    department: 'Engineering',
    status: 'Active',
    joinDate: 'Feb 15, 2023',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    position: 'Product Manager',
    department: 'Product',
    status: 'On Leave',
    joinDate: 'Nov 5, 2022',
    avatar: 'https://randomuser.me/api/portraits/women/63.jpg'
  },
  {
    id: 4,
    name: 'David Kim',
    position: 'Backend Developer',
    department: 'Engineering',
    status: 'Active',
    joinDate: 'Mar 22, 2023',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg'
  },
  {
    id: 5,
    name: 'Jessica Patel',
    position: 'Marketing Specialist',
    department: 'Marketing',
    status: 'Active',
    joinDate: 'Apr 8, 2023',
    avatar: 'https://randomuser.me/api/portraits/women/75.jpg'
  }
];

const EmployeeTable = () => {
  return (
    <div className="bg-hrms-darkblue rounded-xl">
      <div className="p-4 border-b border-hrms-dark">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Employees</h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-hrms-gray" size={14} />
              <input 
                type="text" 
                placeholder="Search employees..." 
                className="bg-hrms-dark border border-hrms-dark rounded-lg py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-hrms-purple w-48 md:w-56"
              />
            </div>
            <button className="flex items-center px-3 py-1.5 bg-hrms-dark rounded-lg text-xs text-hrms-gray">
              <span>All Departments</span>
              <ChevronDown size={14} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-hrms-gray border-b border-hrms-dark">
              <th className="px-4 py-3 font-medium">NAME</th>
              <th className="px-4 py-3 font-medium">POSITION</th>
              <th className="px-4 py-3 font-medium">DEPARTMENT</th>
              <th className="px-4 py-3 font-medium">STATUS</th>
              <th className="px-4 py-3 font-medium">JOIN DATE</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id} className="border-b border-hrms-dark hover:bg-hrms-dark/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <img 
                      src={employee.avatar} 
                      alt={employee.name} 
                      className="h-8 w-8 rounded-full mr-3"
                    />
                    <span className="text-sm font-medium">{employee.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{employee.position}</td>
                <td className="px-4 py-3 text-sm">{employee.department}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    employee.status === 'Active' 
                      ? 'bg-green-500/10 text-green-500' 
                      : employee.status === 'On Leave'
                      ? 'bg-yellow-500/10 text-yellow-500'
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {employee.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{employee.joinDate}</td>
                <td className="px-4 py-3">
                  <button className="p-1 rounded-lg hover:bg-hrms-dark text-hrms-gray">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 flex justify-between items-center border-t border-hrms-dark text-sm">
        <div className="text-hrms-gray">
          Showing <span className="text-white">5</span> of <span className="text-white">285</span> employees
        </div>
        <div className="flex space-x-1">
          <button className="px-3 py-1 rounded-md bg-hrms-dark text-hrms-gray hover:bg-hrms-purple hover:text-white transition-colors">
            Previous
          </button>
          <button className="px-3 py-1 rounded-md bg-hrms-purple text-white">
            1
          </button>
          <button className="px-3 py-1 rounded-md bg-hrms-dark text-hrms-gray hover:bg-hrms-purple hover:text-white transition-colors">
            2
          </button>
          <button className="px-3 py-1 rounded-md bg-hrms-dark text-hrms-gray hover:bg-hrms-purple hover:text-white transition-colors">
            3
          </button>
          <button className="px-3 py-1 rounded-md bg-hrms-dark text-hrms-gray hover:bg-hrms-purple hover:text-white transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;
