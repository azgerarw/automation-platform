import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/authContext";

export default function Login() {
  const { setUserSession, setUserID, setUserRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      
      console.log('Login attempt:', { email, password });
      const res: Response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data: { error: string, authServiceResponse: { token?: string, rt?: string, user_id?: number, message?: string, role?: string } } = await res.json();

      if (res.ok && data.authServiceResponse.token) {
          console.log('Login successful:', data);
          setUserSession(true);
          setUserID(data.authServiceResponse.user_id?.toString() || null);
          setUserRole(data.authServiceResponse.role || null);
          navigate('/');
        } else {
          setError(data.error || data.authServiceResponse.message ||'Login failed');
      } 
    }
    catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-black w-full min-h-screen flex items-center justify-center py-20">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded shadow-[0px_0px_5px_0px_black]">
          <h1 className="text-4xl font-bold text-center mb-2">Login</h1>
          <p className="text-center text-gray-600 mb-8">Sign in to your account</p>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-2 border-red-500 rounded text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                autoComplete="email"
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
                autoComplete="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-2 border-2 border-black rounded focus:outline-none focus:bg-gray-50 transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white px-8 py-3 rounded font-semibold hover:bg-gray-800 active:scale-95 transition cursor-pointer"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-black hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}