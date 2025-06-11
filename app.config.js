
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
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
        }
      },
      permissions: [
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ]
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
      "expo-image-picker",
      [
        "expo-media-library",
        {
          "photosPermission": "Allow $(PRODUCT_NAME) to access your files.",
          "savePhotosPermission": "Allow $(PRODUCT_NAME) to save files."
        }
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": process.env.EXPO_PUBLIC_GOOGLE_ID_CLIENT_SCHEME
        }
      ]
    ],
    experiments: {
      typedRoutes: false
    }
  }
}
