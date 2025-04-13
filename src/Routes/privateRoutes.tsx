import { Navigate } from 'react-router-dom';

import toast from 'react-hot-toast';

const PrivateRoute = ({ children }) => {
  // Check if the token exists in localStorage and if token undefined and null then redirect to login page and not able to access the private route and show hot toast

  const token = localStorage.getItem('token');

  if (!token || token === 'undefined' || token === 'null') {
    // Show a toast notification
    
    return <Navigate to="/api/auth/login"/>;
  }
  // If token exists, render the children (the protected component)
  return children;  

};

export default PrivateRoute;