
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // In a real app, this would handle the logout logic
    // such as clearing tokens, etc.
    localStorage.removeItem('token');

    
    // Redirect to login page after a short delay
    const timer = setTimeout(() => {
      navigate('/api/auth/login');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Logging out...</h1>
        <p className="text-gray-600">You will be redirected to the login page shortly.</p>
      </div>
    </div>
  );
};

export default LogoutPage;
