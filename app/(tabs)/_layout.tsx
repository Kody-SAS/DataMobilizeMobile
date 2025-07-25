import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '../../components/navigation/TabBarIcon'
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { getAllReports } from '../../redux/slices/homeSlice';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {t} = useTranslation();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  return (
    <Tabs
      screenListeners={{
        tabPress: (e) => {
          const tab = e.target?.split("-")[0];
          if (tab == "map") {
            dispatch(getAllReports()); // fetch the reports every time we navigate to the map tab page
          }
        }
      }}
      screenOptions={{
        tabBarActiveTintColor: Colors.light.icon.primary,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t("home"),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: t("exploration"),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "map" : 'map-outline'} color={color} />
          ),
          tabBarHideOnKeyboard: true,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("profile"),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
