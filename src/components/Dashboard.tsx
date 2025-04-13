
import Header from './Header';
import DashboardCards from './DashboardCards';
import EmployeeTable from './EmployeeTable';

const Dashboard = () => {
  return (
    <div className="flex-1 h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <DashboardCards />
        <EmployeeTable />
      </div>
    </div>
  );
};

export default Dashboard;
