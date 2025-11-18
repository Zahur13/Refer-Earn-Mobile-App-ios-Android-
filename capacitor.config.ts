import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.refernearn.app',
  appName: 'Refer-Earn',
  webDir: 'build',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    allowNavigation: [
      '*.firebaseapp.com',
      '*.googleapis.com',
      '*.google.com',
      'firestore.googleapis.com',
      'identitytoolkit.googleapis.com',
      'securetoken.googleapis.com',
      '*.cloudfunctions.net',
      '*.vercel.app',  // ⚡ ADD THIS
      'your-app.vercel.app'  // ⚡ ADD YOUR ACTUAL DOMAIN
    ],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: "#667eea",
      androidSplashResourceName: "splash",
      iosSplashResourceName: "Splash",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#667eea',
    },
    Keyboard: {
      resize: 'native',
      style: 'dark',
      resizeOnFullScreen: true,
    },
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    limitsNavigationsToAppBoundDomains: false,
  },
};

export default config;