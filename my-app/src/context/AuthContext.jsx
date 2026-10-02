import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabaseClient";
import { getUserProfile } from "../services/authService";

const AuthContext = createContext();

// Returns null if the profile is missing or could not be loaded
const fetchProfile = async (userId) => {
  try {
    return await getUserProfile(userId);
  } catch (error) {
    console.error("Profile error:", error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Profile is stored with the user ID it belongs to, so we can tell
  // "profile not loaded yet" apart from "user has no profile".
  const [profileState, setProfileState] = useState({
    userId: null,
    profile: null,
  });

  const userId = user?.id ?? null;

  // ============================================
  // SESSION
  // ============================================

  useEffect(() => {
    let mounted = true;

    // Get existing session from browser storage
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!mounted) return;

        setUser(session?.user ?? null);
        setAuthLoading(false);
      })
      .catch((error) => {
        console.error("Session error:", error);

        if (mounted) {
          setAuthLoading(false);
        }
      });

    // Listen for login/logout/session changes.
    // Do not call other Supabase functions inside this callback,
    // it can deadlock. The profile is loaded by the effect below.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ============================================
  // PROFILE
  // ============================================

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    fetchProfile(userId).then((profileData) => {
      if (!cancelled) {
        setProfileState({ userId, profile: profileData });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Call after creating profile rows
  const refreshProfile = useCallback(async () => {
    if (!userId) return;

    const profileData = await fetchProfile(userId);

    setProfileState({ userId, profile: profileData });
  }, [userId]);

  const profile =
    userId && profileState.userId === userId ? profileState.profile : null;

  const loading =
    authLoading || (userId !== null && profileState.userId !== userId);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
