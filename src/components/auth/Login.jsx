import React, { useState } from "react";
import { auth } from "../../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { LogIn, Mail, Lock } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("🔐 Login: Form submitted");
    console.log("🔐 Login: Email:", formData.email);
    console.log("🔐 Login: Auth object:", auth);
    console.log("🔐 Login: Auth app name:", auth.app.name);

    try {
      console.log("🔐 Login: Calling Firebase signInWithEmailAndPassword...");

      // ⚡ ADD TIMEOUT: Prevent infinite hanging
      const loginPromise = signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Login timeout after 15 seconds")),
          15000
        )
      );

      const userCredential = await Promise.race([loginPromise, timeoutPromise]);

      console.log("✅ Login: Success!", userCredential.user.email);
      console.log("✅ Login: User UID:", userCredential.user.uid);
      toast.success("Login successful!");

      // Wait a bit for auth state to update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect based on role
      navigate("/user/dashboard");
    } catch (error) {
      console.error("❌ Login error:", error);
      console.error("❌ Login error code:", error.code);
      console.error("❌ Login error message:", error.message);
      console.error("❌ Login full error:", JSON.stringify(error, null, 2));

      if (error.message === "Login timeout after 15 seconds") {
        toast.error(
          "Login is taking too long. Please check your internet connection."
        );
      } else if (error.code === "auth/invalid-credential") {
        toast.error("Invalid email or password");
      } else if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email");
      } else if (error.code === "auth/network-request-failed") {
        toast.error("Network error. Please check your connection.");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many failed attempts. Please try again later.");
      } else {
        toast.error(`Login failed: ${error.code || error.message}`);
      }
    } finally {
      setLoading(false);
      console.log("🔐 Login: Process completed");
    }
  };

  // 🧪 TEST BUTTON - Add this temporarily
  const testFirebase = () => {
    console.log("🧪 Testing Firebase...");
    console.log("🧪 Auth object:", auth);
    console.log("🧪 Auth config:", auth.config);
    console.log("🧪 Auth app:", auth.app);
    console.log("🧪 Auth app options:", auth.app.options);
    alert("Check console for Firebase details");
  };

  return (
    <div className="flex justify-center items-center px-4 py-12 min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary-600">
              <LogIn className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>

        <div className="card">
          {/* 🧪 TEST BUTTON - Remove after testing */}
          <button
            onClick={testFirebase}
            type="button"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            🧪 Test Firebase Connection
          </button>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 input-field"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 input-field"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-primary-600 hover:text-primary-700"
                >
                  Sign up
                </Link>
              </p>
            </div>

            {/* Demo credentials - uncomment for testing */}
            <div className="p-4 mt-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="mb-2 text-xs font-semibold text-blue-800">
                Demo Credentials (if you have them):
              </p>
              <p className="text-xs text-blue-700">
                Admin: admin@refernearn.com / admin123
              </p>
              <p className="text-xs text-blue-700">
                User: user@example.com / user123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
