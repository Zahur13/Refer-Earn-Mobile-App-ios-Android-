import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import App from "./TestApp";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";

// Create root first
const root = ReactDOM.createRoot(document.getElementById("root"));

// Initialize Capacitor plugins
const initializeApp = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Configure status bar
      await StatusBar.setStyle({ style: Style.Dark });
      if (Capacitor.getPlatform() === "android") {
        await StatusBar.setBackgroundColor({ color: "#667eea" });
      }

      // Handle back button
      const { App: CapApp } = await import("@capacitor/app");
      CapApp.addListener("backButton", ({ canGoBack }) => {
        if (!canGoBack) {
          CapApp.exitApp();
        } else {
          window.history.back();
        }
      });

      // Hide splash screen after a short delay
      setTimeout(async () => {
        await SplashScreen.hide();
      }, 500);
    } catch (error) {
      console.log("Capacitor initialization error:", error);
    }
  }
};

// Render app immediately
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Initialize Capacitor after render
initializeApp();
