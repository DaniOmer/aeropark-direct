"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Récupérer l'utilisateur actuel
  const fetchUser = async () => {
    setLoading(true);
    let fetchedUser = null;
    try {
      const { data } = await supabase.auth.getUser();
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("email", data.user?.email)
        .single();

      fetchedUser =
        data.user && userData ? { ...data.user, ...userData } : null;
      setUser(fetchedUser);
      return fetchedUser;
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour se connecter
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    let signedInUser = null;
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      signedInUser = await fetchUser();
      return signedInUser;
    } catch (error) {
      console.error("Error signing in:", error);
      setUser(null);
      throw error;
    }
  };

  // Fonction pour se déconnecter
  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour rafraîchir manuellement les données utilisateur
  const refreshUser = async () => {
    return await fetchUser();
  };

  // S'abonner aux changements d'auth
  useEffect(() => {
    fetchUser();

    // S'abonner aux changements d'auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session?.user) await fetchUser();
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
