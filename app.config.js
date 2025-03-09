
export default {
  expo: {
    name: "Data Mobilize",
    slug: "DataMobilize",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.monkeyk1n9.datamobilize"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.monkeyk1n9.datamobilize",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    extra: {
      eas: {
        "projectId": "d7e1f4d3-54de-4400-bc58-7cdf7acf4189"
      }
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-localization",
      "expo-location",
      "expo-image-picker"
    ],
    experiments: {
      typedRoutes: false
    }
  }
}
