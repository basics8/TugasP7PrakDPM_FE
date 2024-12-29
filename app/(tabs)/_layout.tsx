import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#FFD700', // Wolverine's yellow
                tabBarInactiveTintColor: '#FFFFFF', // White for inactive icons
                tabBarStyle: {
                    backgroundColor: '#001f3f', // Wolverine's dark blue
                    borderTopWidth: 0,
                },
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarStyle: Platform.select({
                    ios: {
                        position: "absolute",
                        backgroundColor: '#001f3f',
                        borderTopWidth: 0,
                    },
                    default: {
                        backgroundColor: '#001f3f',
                    },
                }),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Todos",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="list.fill" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name="person.fill" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
