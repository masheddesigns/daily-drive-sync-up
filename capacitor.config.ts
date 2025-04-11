
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5b03d171ab6840c1ace9ed511404db64',
  appName: 'daily-drive-sync-up',
  webDir: 'dist',
  server: {
    url: "https://5b03d171-ab68-40c1-ace9-ed511404db64.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      showSpinner: true,
    },
  },
};

export default config;
