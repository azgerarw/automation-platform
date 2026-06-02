import { createContext, useContext, useState } from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [userSession, setUserSession] = useState<boolean | null>(false);
  const [userID, setUserID] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ userSession, setUserSession, userID, setUserID, userRole, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);