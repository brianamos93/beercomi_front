"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User } from "@/app/utils/def";

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  initialUser: User | null;
  children: ReactNode;
};

export function AuthProvider({ initialUser, children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);

  // 🔑 sync server user to client state
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}