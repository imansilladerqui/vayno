/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { USER_ROLES } from "@/lib/utils";
import { useCurrentProfile } from "@/hooks/queries/useProfileQueries";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isUser: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: profile, isLoading: isProfileLoading } = useCurrentProfile(
    user?.id
  );

  useEffect(() => {
    const initializeSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setSession(session);
      setIsLoading(false);
    };

    initializeSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const userRole = profile?.role || USER_ROLES.USER;
  const isSuperAdmin = userRole === USER_ROLES.SUPERADMIN;
  const isAdmin = userRole === USER_ROLES.ADMIN;
  const isUser = userRole === USER_ROLES.USER;

  const isLoadingAuth = isLoading || isProfileLoading;

  const value = {
    user,
    session,
    isSuperAdmin,
    isAdmin,
    isUser,
    isLoading: isLoadingAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
