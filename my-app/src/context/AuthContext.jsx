import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        // Get existing session from browser storage
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);

          // Get profile
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("id, full_name, email, user_type")
            .eq("id", session.user.id)
            .single();

          if (error) {
            console.error("Profile error:", error);
          } else {
            setProfile(profileData);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Session error:", error);

        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSession();

    // Listen for login/logout/session changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        setUser(session.user);

        const { data: profileData } = await supabase
          .from("profiles")
          .select("id, full_name, email, user_type")
          .eq("id", session.user.id)
          .single();

        if (mounted) {
          setProfile(profileData);
        }
      } else {
        setUser(null);
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};