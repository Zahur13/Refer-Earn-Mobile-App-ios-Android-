import { useState, useEffect, createContext, useContext } from "react";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 useAuth: Setting up auth listener");

    // ⚡ CRITICAL FIX: Safety timeout to prevent infinite loading
    const safetyTimeout = setTimeout(() => {
      console.log(
        "⚠️ useAuth: Safety timeout reached (5s), forcing loading complete"
      );
      setLoading(false);
    }, 5000);

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        console.log(
          "🔍 useAuth: Auth state changed -",
          firebaseUser ? `User: ${firebaseUser.email}` : "No user"
        );

        // Clear safety timeout since we got a response
        clearTimeout(safetyTimeout);

        try {
          if (firebaseUser) {
            setUser(firebaseUser);

            console.log("🔍 useAuth: Fetching user data from Firestore...");

            // Fetch user data from Firestore with timeout
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDoc = await Promise.race([
              getDoc(userDocRef),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Firestore timeout")), 3000)
              ),
            ]);

            if (userDoc.exists()) {
              const data = { id: userDoc.id, ...userDoc.data() };
              setUserData(data);
              console.log(
                "✅ useAuth: User data loaded -",
                data.email,
                "Role:",
                data.role
              );
            } else {
              console.log("⚠️ useAuth: No user document found in Firestore");
              setUserData({ id: firebaseUser.uid, email: firebaseUser.email });
            }
          } else {
            console.log("✅ useAuth: No user logged in");
            setUser(null);
            setUserData(null);
          }
        } catch (error) {
          console.error("❌ useAuth: Error fetching user data:", error);
          // Set basic user data even if Firestore fails
          if (firebaseUser) {
            setUserData({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              error: error.message,
            });
          }
        } finally {
          setLoading(false);
          console.log("✅ useAuth: Loading complete");
        }
      },
      (error) => {
        // ⚡ CRITICAL FIX: Handle auth errors
        console.error("❌ useAuth: Auth listener error:", error);
        clearTimeout(safetyTimeout);
        setLoading(false);
      }
    );

    return () => {
      console.log("🔍 useAuth: Cleaning up");
      clearTimeout(safetyTimeout);
      unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log("🔍 useAuth: Signing out...");
      await firebaseSignOut(auth);
      setUser(null);
      setUserData(null);
      console.log("✅ useAuth: Signed out successfully");
    } catch (error) {
      console.error("❌ useAuth: Sign out error:", error);
      throw error;
    }
  };

  const refreshUserData = async () => {
    if (user) {
      try {
        console.log("🔍 useAuth: Refreshing user data...");
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = { id: userDoc.id, ...userDoc.data() };
          setUserData(data);
          console.log("✅ useAuth: User data refreshed");
          return data;
        }
      } catch (error) {
        console.error("❌ useAuth: Error refreshing user data:", error);
        throw error;
      }
    }
  };

  const value = {
    user,
    userData,
    loading,
    signOut,
    refreshUserData,
    isAdmin: userData?.role === "admin",
  };

  console.log("🔍 useAuth: Current state -", {
    hasUser: !!user,
    hasUserData: !!userData,
    loading,
    isAdmin: userData?.role === "admin",
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
