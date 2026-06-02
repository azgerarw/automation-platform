import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const notify = (message?: string) => toast.custom(
    <div className="bg-white text-black p-4 rounded shadow-[0px_0px_5px_0px_green] w-auto h-auto flex flex-col items-start">
        <strong className="text-sm">{message}</strong>
    </div>
    );

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError('');
      setLoading(true);
  
      
      try {
        
        console.log('Register attempt:', { username, email, password });
        const res: Response = await fetch('http://localhost:3000/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, username }),
        });
  
        const data: { error: string, userServiceResponse: { error: string, message: string, user_id: number, status: number } } = await res.json();
  
        if (data.userServiceResponse.status == 201) {
          console.log('Register successful:', data);
          notify('Registration completed, log in with your new credentials');
          setTimeout(() => navigate('/'), 2000);
          } else {
            setError(data.error || data.userServiceResponse.message || data.userServiceResponse.error ||'Register failed');
        } 
      }
      catch (err) {
        setError('An error occurred during registration. Please try again.');
        console.error('Register error:', err);
      } finally {
        setLoading(false);
      }
    };
  
  
    return (
      <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white text-black w-full min-h-screen flex items-center justify-center py-20">  
            <div className="w-full max-w-md">
              <div className="bg-white p-8 rounded shadow-[0px_0px_5px_0px_black]">
                <h1 className="text-4xl font-bold text-center mb-2">Create Account</h1>
                <p className="text-center text-gray-600 mb-8">Sign up for a new account</p>
      
                {error && (
                  <div className="mb-6 p-4 bg-red-100 border-2 border-red-500 rounded text-red-700">
                    {error}
                  </div>
                )}
      
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Username Input */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-semibold mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="Enter your username"
                      className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:bg-gray-50 transition"
                    />
                  </div>
                  {/* Email Input */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:bg-gray-50 transition"
                    />
                  </div>
      
                  {/* Password Input */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:bg-gray-50 transition"
                    />
                  </div>
                  {/* Terms and Conditions */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        required
                        className="mr-2"
                      />
                      <span className="text-sm">
                        I agree to the{' '}
                        <Link to="/terms" className="text-blue-500 hover:underline">
                          Terms and Conditions
                        </Link>
                      </span>
                    </label>
                  </div>
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white px-8 py-3 rounded font-semibold hover:bg-gray-800 active:scale-95 transition cursor-pointer"
                  >
                    {loading ? 'Creating account...' : 'Sign Up'}
                  </button>
                </form>
      
                {/* Register Link */}
                <p className="text-center mt-6 text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-black hover:underline">
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </div>
          </>
    );
  }