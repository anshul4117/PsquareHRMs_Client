import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Square } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import toast from 'react-hot-toast';
import BASE_URL from '../config/baseUrl';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agree: false,
  });

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await axios.post(`${BASE_URL}/auth/login`, {
          email: formData.email,
          password: formData.password,
        });
        const { token } = res.data; // assuming the backend sends token
        // print  res.data in console
        // console.log(res.data);
        localStorage.setItem('token', token);
        toast.success('Login successful!');
        console.log('Logged in:', res.data);
        navigate('/api/candidates'); // ✅ redirect after login
      } else {
        if (!formData.name || !formData.email || !formData.password) {
          toast.error('Please fill in all required fields');
          return;
        }

        if (formData.agree == false) {
          toast.error('Please accept the terms');
          return;
        }

        const res = await axios.post(`${BASE_URL}/auth/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        if(!formData.agree) {
          toast.error('Please accept the terms');
        }

        toast.success('Registration successful!');
        console.log('Registered:', res.data);
        setIsLogin(true);
        setFormData({
          name: '',
          email: '',
          password: '',
          agree: false,
        });
        navigate('/api/auth/login'); // ✅ navigate to login page
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Something went wrong!';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="pt-16 pb-8">
        <div className="flex items-center justify-center">
          <div className="h-14 w-14 border-2 border-purple-700 flex items-center justify-center">
            <Square size={28} className="text-purple-700" />
          </div>
          <span className="ml-4 text-3xl font-bold text-purple-700">LOGO</span>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 flex-grow flex">
        <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden flex">
          <div className="w-1/2 bg-purple-700 flex flex-col items-center justify-center text-white p-12">
            <div className="max-w-md w-full mx-auto">
              <img src="/lovable-uploads/836e9a9a-1cfc-478e-a816-832451bfdea1.png" alt="Dashboard preview" className="w-full rounded-lg shadow-lg mb-10" />
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Welcome to Dashboard</h2>
                <p className="text-white/80">Sign in to continue or create a new account</p>
              </div>
              <div className="flex justify-center mt-12 space-x-2">
                <div className={`h-2 w-10 rounded-full ${isLogin ? 'bg-white' : 'bg-white/40'}`} />
                <div className={`h-2 w-2 rounded-full ${!isLogin ? 'bg-white' : 'bg-white/40'}`} />
                <div className="h-2 w-2 rounded-full bg-white/40" />
              </div>
            </div>
          </div>

          <div className="w-1/2 bg-white flex items-center justify-center">
            <div className="max-w-sm w-full px-10">
              <h1 className="text-2xl font-semibold text-gray-800 mb-8">{isLogin ? 'Login' : 'Register'}</h1>
              <div className="space-y-5">
                {!isLogin && (
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 block">
                      Name<span className="text-red-500">*</span>
                    </Label>
                    <Input id="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                  </div>
                )}
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">
                    Email Address<span className="text-red-500">*</span>
                  </Label>
                  <Input id="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email Address" />
                </div>
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1 block">
                    Password<span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input id="password" value={formData.password} onChange={handleChange} type={showPassword ? 'text' : 'password'} placeholder="Password" />
                    <button type="button" onClick={toggleShowPassword} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="flex items-start">
                    <Checkbox id="agree" checked={formData.agree} onCheckedChange={() => setFormData({ ...formData, agree: !formData.agree })} className="mt-1" />
                    <Label htmlFor="agree" className="ml-2 text-sm text-gray-600">
                      I agree to the terms and conditions.
                    </Label>
                  </div>
                )}

                {isLogin && (
                  <div className="flex justify-end">
                    <a href="#" className="text-sm text-gray-600 hover:text-purple-700">
                      Forgot password?
                    </a>
                  </div>
                )}

                <Button onClick={handleSubmit} className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-md">
                  {isLogin ? 'Login' : 'Register'}
                </Button>

                <div className="text-center text-sm text-gray-600 pt-1">
                  {isLogin ? (
                    <>
                      Don’t have an account?
                      <button onClick={() => setIsLogin(false)} className="text-purple-700 font-medium ml-1">Register</button>
                    </>
                  ) : (
                    <>
                      Already have an account?
                      <button onClick={() => setIsLogin(true)} className="text-purple-700 font-medium ml-1">Login</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-8" />
    </div>
  );
};

export default AuthPage;
