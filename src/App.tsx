// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
import {Toaster} from 'react-hot-toast';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import AuthPage from "./pages/AuthPage";
import CandidatesPage from "./pages/CandidatesPage";
import EmployeesPage from "./pages/EmployeesPage";
import AttendancePage from "./pages/AttendancePage";
import LeavesPage from "./pages/LeavesPage";
import LogoutPage from "./pages/LogoutPage";
import NotFound from "./pages/NotFound";

import PrivateRoute from "./Routes/privateRoutes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/api/auth/login" element={<AuthPage />} />
          <Route path="/" element={<Navigate to="api/auth/login" />} />
          <Route
            path="/api/candidates"
            element={<PrivateRoute><CandidatesPage /></PrivateRoute>}
          />
          <Route
            path="/api/employees"
            element={<PrivateRoute><EmployeesPage /></PrivateRoute>}
          />
          <Route
            path="/api/attendance"
            element={<PrivateRoute><AttendancePage /></PrivateRoute>}
          />
          <Route
            path="/api/leaves"
            element={<PrivateRoute><LeavesPage /></PrivateRoute>}
          />
          <Route
            path="/logout"
            element={<PrivateRoute><LogoutPage /></PrivateRoute>}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
