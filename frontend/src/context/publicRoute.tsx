import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { userSession, setUserSession, setUserID } = useAuth();
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const checkSession = async () => {
        try {
          const res = await fetch("http://localhost:3000/users/check-session", {
            method: "POST",
            credentials: "include",
          });
  
          if (res.ok) {
            const data = await res.json();
            setUserSession(data.token ? true : false);
            setUserID(data.user_id?.toString() || null);
          } else {
            setUserSession(false);
          }
        } catch (err) {
          setUserSession(false);
        } finally {
          setLoading(false);
        }
      };
  
      checkSession();
    }, []);
  
    if (loading) return <p>Loading...</p>;
  
    if (userSession == true) {
      return <Navigate to="/" replace />;
    }

  return children;
};

export default PublicRoute;