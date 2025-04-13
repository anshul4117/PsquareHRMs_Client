
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, MoreVertical, Search, Trash2, X } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from 'axios';
import BASE_URL from '@/config/baseUrl';
import toast from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type EmployeeDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  isEdit?: boolean;
  employee?: any;
  fetchSelectedEmployees: () => void;
};

const EmployeeDialog: React.FC<EmployeeDialogProps> = ({
  isOpen,
  onClose,
  isEdit = false,
  employee,
  fetchSelectedEmployees,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [joiningDate, setJoiningDate] = useState("");

  useEffect(() => {
    if (isEdit && employee) {
      setName(employee.name || "");
      setEmail(employee.email || "");
      setPhone(employee.phone || "");
      setDepartment(employee.department || "");
      setPosition(employee.position || "");
      setJoiningDate(employee.joiningDate?.slice(0, 10) || "");
    } else {
      // Clear form fields for Add
      setName("");
      setEmail("");
      setPhone("");
      setDepartment("");
      setPosition("");
      setJoiningDate("");
    }
  }, [isOpen, isEdit, employee]);

  const handleSubmit = async () => {
    try {
      if (!name || !email || !phone || !department || !position || !joiningDate) {
        return toast.error("Please fill in all fields");
      }

      const token = localStorage.getItem("token");

      const payload = {
        name,
        email,
        phone,
        department,
        position,
        joiningDate,
        ...(isEdit && employee?._id && { _id: employee._id }) // Include ID in body only for edit
      };

      if (isEdit) {
        await axios.put(`${BASE_URL}/employees`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Employee updated successfully");
      } else {
        await axios.post(`${BASE_URL}/employees`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Employee added successfully");
      }

      fetchSelectedEmployees();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Employee" : "Add Employee"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input type="text" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />

          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="appearance-none w-full bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-sm leading-tight text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="">Select Position</option>
            <option value="Intern">Intern</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
            <option value="Developer">Developer</option>
            <option value="Manager">Manager</option>
          </select>

          <Input type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} />
        </div>

        <Button onClick={handleSubmit} className="w-full">
          {isEdit ? "Update Employee" : "Add Employee"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

// export default EmployeeDialog;

const EmployeesPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({});
  const [employees, setEmployees] = useState([]);



  const fetchSelectedEmployees = async () => {
    try {
      const token = localStorage.getItem("token"); // or use cookies if stored there
      if (!token) {
        throw new Error("No auth token found");
      }

      const response = await axios.get(`${BASE_URL}/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched employee:", response.data);
      setEmployees(response.data);
      // // setCandidateStatuses(
      // //   response.data.map((c: any) => ({ id: c._id, status: c.status }))
      // );

    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  const handleEditEmployee = (employee: any) => {
    setCurrentEmployee(employee);
    setIsEditDialogOpen(true);
  };

  useEffect(() => {
    fetchSelectedEmployees();
  }, []);



  const handleDeleteEmployee = async (id: string) => {
    // console.log('Delete candidate:', id);
    // Implement delete api functionality
    try {
      const token = localStorage.getItem("token"); // or use cookies if stored there
      if (!token) {
        throw new Error("No auth token found");
      }

      const response = await axios.delete(`${BASE_URL}/employees`, { // pass candidate id in body
        data: { id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Employees Deleted");
      // when candidate deleted the call get all candidated
      fetchSelectedEmployees();
    } catch (error: any) {
      console.error("Failed to delete candidates:", error.response?.data || error.message);
    }
  };

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div className="relative inline-block">
          <select className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-sm leading-tight text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500">
            <option>Position</option>
            <option>Intern</option>
            <option>Junior</option>
            <option>Senior</option>
            <option>Manager</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* employee table */}
      <Table className="w-full">
        <TableHeader className="bg-purple-700 text-white rounded-t-lg">
          <TableRow>
            <TableHead className="text-white font-medium text-left py-3 px-4">Profile</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Employee Name</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Email Address</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Phone Number</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Position</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Department</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Date of Joining</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id} className="hover:bg-gray-50">
              <TableCell className="py-3 px-4"></TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{employee.name}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{employee.email}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{employee.phone}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{employee.position}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{employee.department}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">
                {/* convert database date into simple date */}
                {new Date(employee.joiningDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="py-3 px-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-gray-500 hover:text-gray-700">
                      <MoreVertical size={18} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border-gray-200">
                    <DropdownMenuItem
                      onClick={() => handleEditEmployee(employee)}
                      className="text-black hover:bg-gray-100 cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteEmployee(employee._id)}
                      className="text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EmployeeDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        isEdit={false}
        fetchSelectedEmployees={fetchSelectedEmployees}
      />


      <EmployeeDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        isEdit={true}
        employee={currentEmployee}
        fetchSelectedEmployees={fetchSelectedEmployees}
      />
    </MainLayout>
  );
};

export default EmployeesPage;
