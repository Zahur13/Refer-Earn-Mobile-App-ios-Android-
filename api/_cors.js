module.exports = function cors(req, res) {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://refer-earn-platform.vercel.app",
    "capacitor://localhost", // ⚡ ADD THIS for iOS
    "http://localhost", // ⚡ ADD THIS for Android
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ].filter(Boolean);

  const origin = req.headers.origin;

  // Allow all origins for mobile (since Capacitor doesn't always send proper origin)
  if (
    origin &&
    (allowedOrigins.includes(origin) || origin.startsWith("capacitor://"))
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (!origin) {
    // No origin header (common in mobile apps)
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }

  return false;
};
