import React from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ color: "#667eea" }}>✅ App Working!</h1>
      <p>Time: {new Date().toLocaleTimeString()}</p>
      <Link to="/test" style={{ color: "#667eea", fontSize: "18px" }}>
        Go to Test Page
      </Link>
    </div>
  );
}

function TestPage() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ color: "#10b981" }}>✅ Routing Works!</h1>
      <Link to="/" style={{ color: "#667eea", fontSize: "18px" }}>
        Go Back Home
      </Link>
    </div>
  );
}

function TestApp() {
  console.log("🚀 TestApp rendered");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default TestApp;
