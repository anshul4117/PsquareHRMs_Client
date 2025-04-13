
import { useState, useEffect } from 'react';
import { Edit, MoreVertical, Search, Trash2, X } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import axios from 'axios';
import BASE_URL from '../config/baseUrl';
import toast from 'react-hot-toast';



// hit the api to get the All candidates data


type CandidateDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  refreshCandidates?: () => void; 
};

const AddCandidateDialog = ({ isOpen, onClose, refreshCandidates }: CandidateDialogProps) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    position: "",
    status: "Pending", // default status
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!resumeFile) {
      toast.error("Resume file is required.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // or use cookies if stored there
      if (!token) {
        throw new Error("No auth token found");
      }
      const candidateForm = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        candidateForm.append(key, value);
      });
      candidateForm.append("resume", resumeFile);

      await axios.post(`${BASE_URL}/candidates/add`, candidateForm, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // or use cookies if stored there
        },
      });

      toast.success("Candidate added successfully!");
      if (refreshCandidates) refreshCandidates();
      onClose();
    } catch (error: any) {
      console.error("Error adding candidate:", error);
      toast.error("Failed to add candidate.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="bg-purple-700 text-white p-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add New Candidate</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Full Name<span className="text-red-500">*</span></label>
              <Input type="text" name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Email Address<span className="text-red-500">*</span></label>
              <Input type="email" name="email" value={formData.email} onChange={handleInputChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Phone Number<span className="text-red-500">*</span></label>
              <Input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Position<span className="text-red-500">*</span></label>
              <Input type="text" name="position" value={formData.position} onChange={handleInputChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Experience<span className="text-red-500">*</span></label>
              <Input type="text" name="experience" value={formData.experience} onChange={handleInputChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Resume<span className="text-red-500">*</span></label>
              <Input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center">
              <Checkbox id="declaration" />
              <label htmlFor="declaration" className="ml-2 text-sm text-gray-800">
                I hereby declare that the above information is true to the best of my knowledge and belief
              </label>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={handleSubmit} className="bg-purple-600 text-white hover:bg-purple-700 px-12">
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CandidatesPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [candidatesData, setCandidatesData] = useState([]);
  const [candidateStatuses, setCandidateStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem("token"); // or use cookies if stored there
      if (!token) {
        throw new Error("No auth token found");
      }
      // console.log(token);

      const response = await axios.get(`${BASE_URL}/candidates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched candidates:", response.data);
      setCandidatesData(response.data);
      setCandidateStatuses(
        response.data.map((c: any) => ({ id: c._id, status: c.status }))
      );

    } catch (error: any) {
      console.error("Failed to fetch candidates:", error.response?.data || error.message);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      // Update candidate's status
      const token = localStorage.getItem("token"); // or use cookies if stored there
      if (!token) {
        throw new Error("No auth token found");
      }


      await axios.post(`${BASE_URL}/candidates/promote`,
        // send id and status in body
        { id, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

      );

      // If selected → promote to employee
      // if (status === 'Selected') {
      //   await axios.post(`${BASE_URL}/employees/promote`, { id });
      // }

      // Optionally: Refresh candidates list
      toast.success('Status updated successfully!');
      fetchCandidates();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status.');
    }
  };


  const filteredCandidates = candidatesData.filter(candidate => {
    const statusMatch = selectedStatus ? candidate.status === selectedStatus : true;
    const positionMatch = selectedPosition ? candidate.position === selectedPosition : true;
    return statusMatch && positionMatch;
  });


  const handleEditCandidate = (id: string) => {
    console.log('Edit candidate:', id);
    // Implement edit functionality
  };

  const handleDeleteCandidate = async (id: string) => {
    // Implement delete api functionality
    try {
      const token = localStorage.getItem("token"); // or use cookies if stored there
      if (!token) {
        throw new Error("No auth token found");
      }

      await axios.delete(`${BASE_URL}/candidates`, { // pass candidate id in body
        data: { id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Candidate Deleted");
      fetchCandidates();
      // when candidate deleted the call get all candidated
      // setCandidatesData(response.data);
      // setCandidateStatuses(
      //   response.data.map((c: any) => ({ id: c.id, status: c.status }))
      // );
    } catch (error: any) {
      console.error("Failed to delete candidates:", error.response?.data || error.message);
    }
  };



  useEffect(() => {
    fetchCandidates();
    // when click handleDeleteCandidate then run this handleDeleteCandidate function and geting one id as argument
  }, []);





  const getStatusForCandidate = (id: string) => {
    // console.log("id :" ,id)
    // console.log(candidateStatuses[0].id)
    const statusObj = candidateStatuses.find(item => item.id === id);
    return statusObj ? statusObj.status : 'Pending';
  };


  return (
    <MainLayout>
      {/* dive for status and position field */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="relative inline-block">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-sm leading-tight text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="">Status</option>
              <option value="Pending">Pending</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          <div className="relative inline-block">
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-sm leading-tight text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="">Position</option>
              <option value="Intern">Intern</option>
              <option value="Full Time">Full Time</option>
              <option value="Designer">Designer</option>
              <option value="Developer">Developer</option>
              <option value="Manager">Manager</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
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
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md"
          >
            Add Candidate
          </Button>
        </div>
      </div>

      <Table className="w-full">
        <TableHeader className="bg-purple-700 text-white rounded-t-lg">
          <TableRow>
            <TableHead className="text-white font-medium text-left py-3 px-4">Sr no.</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Candidates Name</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Email Address</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Phone Number</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Position</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Status</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Experience</TableHead>
            <TableHead className="text-white font-medium text-left py-3 px-4">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCandidates.map((candidate, index) => (
            <TableRow key={`candidate-${index}`} className="hover:bg-gray-50">
              <TableCell className="py-3 px-4 text-gray-800">{index + 1}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{candidate.name}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{candidate.email}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{candidate.phone}</TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{candidate.position}</TableCell>
              <TableCell className="py-3 px-4">
                <Select
                  value={getStatusForCandidate(candidate._id)}
                  onValueChange={(value) => handleStatusChange(candidate._id, value)}
                >
                  <SelectTrigger className="w-[130px] h-8 bg-white text-black border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Selected">Selected</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="py-3 px-4 text-gray-800">{candidate.experience} Years</TableCell>
              <TableCell className="py-3 px-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-gray-500 hover:text-gray-700">
                      <MoreVertical size={18} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border-gray-200">
                    {/* <DropdownMenuItem
                      onClick={() => handleEditCandidate(candidate._id)}
                      className="text-black hover:bg-gray-100 cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem
                      onClick={() => handleDeleteCandidate(candidate._id)}
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

      <AddCandidateDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />
    </MainLayout>
  );
};

export default CandidatesPage;
