
import { useState, useEffect } from 'react';
import { Edit, MoreVertical, Search, Trash2 } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BASE_URL from '@/config/baseUrl';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Mock attendance data
// const attendanceData = [
//   {
//     id: '1',
//     name: 'Jane Copper',
//     position: 'Full Time',
//     department: 'Designer',
//     task: 'Dashboard Home page Alignment',
//     status: 'Present',
//   }
// ];

const AttendancePage = () => {
  const [attendanceStatuses, setAttendanceStatuses] = useState([]);
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
      console.log('Attendance data:', data);

      setAttendanceData(data);
      setAttendanceStatuses(
        data.map((a: any) => ({ id: a.id, status: a.status }))
      );
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    const previousStatuses = [...attendanceStatuses]; // Keep a copy in case we need to rollback

    // Optimistically update UI
    setAttendanceStatuses(prev =>
      prev.map(item => item.id === id ? { ...item, status } : item)
    );

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Unauthorized: Token not found.");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/attendance`,
        { id, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Attendance status updated!");

      // Re-fetch the latest data from the backend to reflect changes
      fetchAttendance();

    } catch (error: any) {
      // Rollback to previous status on failure
      setAttendanceStatuses(previousStatuses);
      toast.error(
        error?.response?.data?.message || "Failed to update attendance status."
      );
      console.error('Error updating attendance status:', error);
    }
  };


  const getStatusForAttendance = (id: string) => {
    const statusObj = attendanceStatuses.find(item => item.id === id);
    return statusObj ? statusObj.status : 'Present';
  };

  const handleEditAttendance = (id: string) => {
    console.log('Edit attendance:', id);
    // Implement edit functionality
  };

  const handleDeleteAttendance = (id: string) => {
    console.log('Delete attendance:', id);
    // Implement delete functionality
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div className="relative inline-block">
          <Select>
            <SelectTrigger className="bg-white text-black border-gray-300 w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="Present">Present</SelectItem>
              <SelectItem value="Absent">Absent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <Input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>

      <Table className="w-full">
        <TableHeader className="bg-purple-700 text-white rounded-t-lg">
          <TableRow>
            <TableHead className="text-white font-medium text-left py-3 px-4">Profile</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Employee Name</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Position</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Department</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Task</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Status</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendanceData.map((attendance) => (
            <TableRow key={attendance.id} className="hover:bg-gray-50">
              <TableCell className="py-3 px-4"></TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{attendance.employeeName}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{attendance.position}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{attendance.department}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{attendance.task}</TableCell>
              <TableCell className="py-3 px-4">
                <Select
                  value={getStatusForAttendance(attendance.id)}
                  onValueChange={(value) => handleStatusChange(attendance._id, value)}
                >
                  <SelectTrigger className="w-28 h-8 bg-white text-black border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    <SelectItem value="Present">Present</SelectItem>
                    <SelectItem value="Absent">Absent</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="py-3 px-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-gray-500 hover:text-gray-700">
                      <MoreVertical size={18} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white text-black border-gray-200">
                    <DropdownMenuItem
                      onClick={() => handleEditAttendance(attendance.id)}
                      className="text-black hover:bg-gray-100 cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteAttendance(attendance.id)}
                      className="text-red-600 hover:bg-red-50 cursor-pointer"
                    >
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
    </MainLayout>
  );
};

export default AttendancePage;
