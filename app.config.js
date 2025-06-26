import { version } from "react";

export default {
  expo: {
    name: "Data Mobilize",
    slug: "DataMobilize",
    version: "1.0.2",
    orientation: "portrait",
    icon: "./assets/images/applogo.png",
    scheme: "myapp",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.kody.datamobilize"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/applogo.png",
        backgroundColor: "#ffffff"
      },
      versionCode: 3,
      package: "com.kody.datamobilize",
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
          "iosUrlScheme":  "com.googleusercontent.apps.223869268641-6oj8mdp3fdv2a7se0dhjvmogro15qrav"
        }
      ],
      [
        'expo-build-properties', 
        { 
          android: 
          { 
            compileSdkVersion: 35, 
            targetSdkVersion: 34, 
            buildToolsVersion: '35.0.0', 
            kotlinVersion: '1.9.25', 
          }, 
        }
      ],
      [
        "expo-asset",
        {
          "assets": ["./assets/docs/privacypolicy.pdf"]
        }
      ]
    ],
    experiments: {
      typedRoutes: false
    }
  }
}
