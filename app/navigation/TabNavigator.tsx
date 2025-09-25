import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "@expo/vector-icons/Ionicons";

import DashboardScreen from "../(tabs)/DashboardScreen";
import ComplianceLogScreen from "../(tabs)/ComplianceLogScreen";
import AwarenessHubScreen from "../(tabs)/AwarenessHubScreen";
import ReportIssueScreen from "../(tabs)/ReportIssueScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Icon.glyphMap = "home-outline";
            if (route.name === "Dashboard") iconName = "home-outline";
            else if (route.name === "Compliance Log") iconName = "checkmark-done-outline";
            else if (route.name === "Awareness Hub") iconName = "leaf-outline";
            else if (route.name === "Report Issue") iconName = "alert-circle-outline";
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#1E90FF",
          tabBarInactiveTintColor: "gray",
          headerShown: true,
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Compliance Log" component={ComplianceLogScreen} />
        <Tab.Screen name="Awareness Hub" component={AwarenessHubScreen} />
        <Tab.Screen name="Report Issue" component={ReportIssueScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
