import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, FileText, MoreVertical, Search, X } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from 'axios';
import toast from 'react-hot-toast';
import BASE_URL from "../config/baseUrl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Edit,
  Trash2,
} from 'lucide-react';

// Mock leaves data
// const leavesData = [
//   {
//     id: '1',
//     name: 'Jane Copper',
//     position: 'Full Time Designer',
//     date: '10/09/24',
//     reason: 'Visiting House',
//     status: 'Approved',
//     docs: '',
//   }
// ];

// Calendar data
const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const currentMonth = 'September, 2024';
const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

type LeaveDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  attendanceData: any[];
};


const AddLeaveDialog = ({ isOpen, onClose, attendanceData }: LeaveDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<{ name: string; designation: string } | null>(null);
  const [leaveDate, setLeaveDate] = useState('');
  const [reason, setReason] = useState('');

  
  // console.log('Attendance Data:', attendanceData);
  console.log('Filtered Employees:', filteredEmployees);
  // console.log('Selected Employee:', selectedEmployee);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = attendanceData.filter((emp: any) =>
        emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) && emp.status === "Present"
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees([]);
    }
  }, [searchTerm, attendanceData]);

  const handleSelectEmployee = (employee: any) => {
    setSelectedEmployee({ name: employee.employeeName, designation: employee.position });
    setSearchTerm(employee.employeeName);
    setFilteredEmployees([]);
  };

  const handleSaveLeave = async () => {
    if (!selectedEmployee || !leaveDate || !reason) {
      toast.error("Please fill all required fields.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
  
      const response = await axios.post(
        `${BASE_URL}/leaves`,
        {
          employee: selectedEmployee.name,
          position: selectedEmployee.designation,
          startDate: leaveDate,
          reason,
          status: "Approved",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Leave submission response:", response.data);
  
      toast.success("Leave applied successfully!");
      onClose();
      // refresh the window to see the changes
      window.location.reload();
    } catch (error) {
      toast.error("Something went wrong. Try again.");
      console.error("Leave submission failed:", error);
    }
  };
  


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="bg-purple-700 text-white p-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add New Leave</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Search Employee Name
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search Employee Name"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {filteredEmployees.length > 0 && (
                  <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded shadow">
                    {filteredEmployees.map((emp, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelectEmployee(emp)}
                        className="px-4 py-2 hover:bg-black-100 cursor-pointer"
                      >
                        {emp.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Designation<span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={selectedEmployee?.designation || ''}
                readOnly
                className="w-full text-gray-800 bg-gray-100"
              />
            </div>
          </div>


          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Leave Date<span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                className="w-full text-gray-800"
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-gray-800">
              Reason<span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              className="w-full text-gray-800"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="flex justify-center">
          <Button onClick={handleSaveLeave} className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-12">
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LogoutDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="bg-purple-700 text-white p-4 rounded-t-lg flex items-center justify-center">
          <h2 className="text-xl font-semibold">Log Out</h2>
        </div>

        <div className="p-6">
          <p className="text-center mb-6 text-gray-800">Are you sure you want to log out?</p>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={onClose}
              className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-8 rounded-md"
            >
              Cancel
            </Button>
            <Button className="bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 py-2 px-8 rounded-md">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeavesPage = () => {
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [attendanceStatuses, setAttendanceStatuses] = useState([]);
  const [leavesData, setLeaveData] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState([]);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('token'); // Or use cookies
      if (!token) return;

      const response = await axios.get(`${BASE_URL}/attendance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      // console.log('Leave att data:', data);

      setAttendanceData(data);
      setAttendanceStatuses(
        data.map((a: any) => ({ id: a.id, status: a.status }))
      );
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };
  // fetch all leaves
  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('token'); // Or use cookies
      if (!token) return;
      const response = await axios.get(`${BASE_URL}/leaves`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      console.log('Leave data:', data);
      setLeaveData(data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };
  // next after fetching leaves show the data in table 
  useEffect(() => {
    fetchLeaves();
  }, []);


  

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <MainLayout>
      <div className="flex space-x-6">
        <div className="w-3/5">
          <div className="mb-6 flex justify-between items-center">
            <div className="relative inline-block">
              <Select>
                <SelectTrigger className="bg-white text-black border-gray-300 w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black">
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <Button
                onClick={() => setIsAddLeaveOpen(true)}
                className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md"
              >
                Add Leave
              </Button>
            </div>
          </div>

          <div className="bg-purple-700 text-white p-4 rounded-t-lg">
            <h2 className="text-lg font-semibold">Applied Leaves</h2>
          </div>

          <Table className="w-full">
            <TableHeader className="bg-purple-700 text-white">
              <TableRow>
                <TableHead className="text-white font-medium text-left py-3 px-4">Profile</TableHead>
                <TableHead className="text-white font-medium text-left py-3 px-4">Name</TableHead>
                <TableHead className="text-white font-medium text-left py-3 px-4">Date</TableHead>
                <TableHead className="text-white font-medium text-left py-3 px-4">Reason</TableHead>
                <TableHead className="text-white font-medium text-left py-3 px-4">Status</TableHead>
                <TableHead className="text-white font-medium text-left py-3 px-4">Docs</TableHead>
                <TableHead className="text-white font-medium text-left py-3 px-4">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leavesData.map((leave) => (
                <TableRow key={leave.id} className="hover:bg-gray-50">
                  <TableCell className="py-3 px-4"></TableCell>
                  <TableCell className="py-3 px-4">
                    <div>
                      <div className="text-gray-800">{leave.employee}</div>
                      <div className="text-xs text-gray-500">{leave.position}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-800">{
                    // convert date to dd/mm/yyyy
                    new Date(leave.startDate).toLocaleDateString()
                    }</TableCell>
                  <TableCell className="py-3 px-4 text-gray-800">{leave.reason}</TableCell>
                  <TableCell className="py-3 px-4">
                    <Select defaultValue={leave.status}>
                      <SelectTrigger className="w-28 h-8 bg-white text-black border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-black">
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  {/* <TableCell className="py-3 px-4">
                    {leave.docs ? (
                      <button className="text-gray-500 hover:text-gray-700">
                        <FileText size={18} />
                      </button>
                    ) : null}
                  </TableCell> */}
                  <TableCell className="py-3 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-gray-500 hover:text-gray-700">
                          <MoreVertical size={18} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white text-black border-gray-200">
                        <DropdownMenuItem className="text-black hover:bg-gray-100 cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 hover:bg-red-50 cursor-pointer">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="w-2/5">
          <div className="bg-purple-700 text-white p-4 rounded-t-lg">
            <h2 className="text-lg font-semibold">Leave Calendar</h2>
          </div>

          <div className="border border-gray-200 rounded-b-lg p-4 bg-white">
            <div className="flex justify-between items-center mb-4">
              <button className="p-1 hover:bg-gray-100 rounded text-gray-700">
                <ChevronLeft size={18} />
              </button>
              <h3 className="font-semibold text-gray-800">{currentMonth}</h3>
              <button className="p-1 hover:bg-gray-100 rounded text-gray-700">
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {daysOfWeek.map((day, index) => (
                <div key={index} className="text-center font-medium py-2 text-gray-800">{day}</div>
              ))}

              {/* Empty cells for alignment */}
              <div className="h-8"></div>
              <div className="h-8"></div>
              <div className="h-8"></div>
              <div className="h-8"></div>
              <div className="h-8"></div>
              <div className="h-8"></div>

              {calendarDays.map((day) => {
                const isHighlighted = day === 8 || day === 10;
                const isPast = day === 15;

                return (
                  <div
                    key={day}
                    className={`
                      h-8 flex items-center justify-center rounded-md text-sm
                      ${isHighlighted ? 'bg-purple-700 text-white' : ''}
                      ${isPast ? 'bg-purple-100 text-gray-800' : ''}
                      ${!isHighlighted && !isPast ? 'hover:bg-gray-100 text-gray-800' : ''}
                    `}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-purple-700 mb-2">Approved Leaves</h3>
              {leavesData.map((leave) => (
                <div key={leave.id} className="flex justify-between py-2">
                  <div>
                    <div className="text-gray-800">{leave.name}</div>
                    <div className="text-xs text-gray-500">{leave.position}</div>
                  </div>
                  <div className="text-sm text-gray-800">{leave.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddLeaveDialog
        isOpen={isAddLeaveOpen}
        onClose={() => setIsAddLeaveOpen(false)}
        attendanceData={attendanceData}
      />

      <LogoutDialog
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
      />
    </MainLayout>
  );
};

export default LeavesPage;
