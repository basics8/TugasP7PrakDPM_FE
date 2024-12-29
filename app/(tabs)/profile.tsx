import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import {
    ActivityIndicator,
    Button,
    Dialog,
    PaperProvider,
    Portal,
    Text,
} from "react-native-paper";
import API_URL from "@/config/config";
import { useColorScheme } from "@/hooks/useColorScheme";

type UserProfile = {
    username: string;
    email: string;
};

const ProfileScreen = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get<{ data: UserProfile }>(
                `${API_URL}/api/profile`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setProfile(response.data.data);
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setDialogVisible(true);
    };

    const confirmLogout = async () => {
        await AsyncStorage.removeItem("token");
        router.replace("/auth/LoginScreen");
    };

    if (loading) {
        return (
            <PaperProvider>
                <ThemedView style={styles.container}>
                    <ActivityIndicator animating={true} color="#FFCC00" />
                </ThemedView>
            </PaperProvider>
        );
    }

    return (
        <PaperProvider>
            <ThemedView
                style={[
                    styles.container,
                    { backgroundColor: isDark ? "#2E2E2E" : "#FFFFFF" },
                ]}
            >
                {profile ? (
                    <ThemedView>
                        <ThemedText
                            style={[
                                styles.title,
                                { color: isDark ? "#FFCC00" : "#333333" },
                            ]}
                        >
                            Profile
                        </ThemedText>
                        <ThemedText
                            style={[
                                styles.label,
                                { color: isDark ? "#FFFFFF" : "#333333" },
                            ]}
                        >
                            Username:
                        </ThemedText>
                        <ThemedText
                            style={[
                                styles.value,
                                { color: isDark ? "#FFCC00" : "#666666" },
                            ]}
                        >
                            {profile.username}
                        </ThemedText>
                        <ThemedText
                            style={[
                                styles.label,
                                { color: isDark ? "#FFFFFF" : "#333333" },
                            ]}
                        >
                            Email:
                        </ThemedText>
                        <ThemedText
                            style={[
                                styles.value,
                                { color: isDark ? "#FFCC00" : "#666666" },
                            ]}
                        >
                            {profile.email}
                        </ThemedText>
                        <Button
                            mode="contained"
                            onPress={handleLogout}
                            style={styles.logoutButton}
                            buttonColor={isDark ? "#333333" : "#FFCC00"}
                            textColor={isDark ? "#FFCC00" : "#FFFFFF"}
                        >
                            Log Out
                        </Button>
                    </ThemedView>
                ) : (
                    <ThemedText
                        style={{ color: isDark ? "#FFFFFF" : "#333333" }}
                    >
                        No profile data available
                    </ThemedText>
                )}
                <Portal>
                    <Dialog
                        visible={dialogVisible}
                        onDismiss={() => setDialogVisible(false)}
                        style={styles.dialog}
                    >
                        <Dialog.Title
                            style={styles.dialogTitle}
                        >
                            Logout
                        </Dialog.Title>
                        <Dialog.Content>
                            <Text style={styles.dialogText}>
                                Are you sure you want to logout?
                            </Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button
                                onPress={() => setDialogVisible(false)}
                                textColor="#FFCC00"
                            >
                                Cancel
                            </Button>
                            <Button
                                onPress={confirmLogout}
                                textColor="#FFCC00"
                            >
                                OK
                            </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </ThemedView>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 24,
    },
    label: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 16,
    },
    value: {
        fontSize: 18,
    },
    logoutButton: {
        marginTop: 24,
    },
    dialog: {
        backgroundColor: "#2E2E2E", // Wolverine dark theme
    },
    dialogTitle: {
        color: "#FFCC00", // Wolverine yellow
    },
    dialogText: {
        color: "#FFFFFF", // Light text
    },
});

export default ProfileScreen;
