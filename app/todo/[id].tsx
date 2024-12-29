import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import {
    ActivityIndicator,
    Button,
    Card,
    Dialog,
    Portal,
    Provider as PaperProvider,
    Text,
    TextInput,
} from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import API_URL from "@/config/config";
import { ThemedView } from "@/components/ThemedView";
import { useTodos } from "@/context/TodoContext";

type Todo = {
    _id: string;
    title: string;
    description: string;
};

const TodoDetailScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { updateTodo } = useTodos();
    const [todo, setTodo] = useState<Todo | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchTodo();
    }, [id]);

    const fetchTodo = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get<{ data: Todo }>(`${API_URL}/api/todos/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const fetchedTodo = response.data.data;
            setTodo(fetchedTodo);
            setTitle(fetchedTodo.title);
            setDescription(fetchedTodo.description);
        } catch (error) {
            console.error("Failed to fetch todo", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTodo = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const response = await axios.put<{ data: Todo }>(
                `${API_URL}/api/todos/${id}`,
                { title, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const updatedTodo = response.data.data;
            setTodo(updatedTodo);
            updateTodo(updatedTodo);
            setVisible(true);
        } catch (error) {
            console.error("Failed to update todo", error);
        }
    };

    const hideDialog = () => {
        setVisible(false);
        router.back();
    };

    if (loading) {
        return (
            <PaperProvider>
                <ThemedView style={styles.container}>
                    <ActivityIndicator style={styles.loading} animating={true} color="#FFC107" />
                </ThemedView>
            </PaperProvider>
        );
    }

    if (!todo) {
        return null;
    }

    return (
        <PaperProvider>
            <Stack.Screen options={{ title: "Todo Detail" }} />
            <ThemedView style={styles.container}>
                <Card style={styles.card} elevation={3}>
                    <Card.Content>
                        <TextInput
                            label="Title"
                            value={title}
                            onChangeText={setTitle}
                            style={styles.input}
                            mode="outlined"
                            theme={{ colors: { text: "#000000", placeholder: "#FFC107", background: "#FFFFFF", outline: "#FFC107" } }}
                        />
                        <TextInput
                            label="Description"
                            value={description}
                            onChangeText={setDescription}
                            style={styles.input}
                            mode="outlined"
                            multiline
                            theme={{ colors: { text: "#000000", placeholder: "#FFC107", background: "#FFFFFF", outline: "#FFC107" } }}
                        />
                        <Button
                            mode="contained"
                            onPress={handleUpdateTodo}
                            style={styles.updateButton}
                            buttonColor="#FFC107"
                            textColor="#000000"
                        >
                            Update Todo
                        </Button>
                    </Card.Content>
                </Card>
                <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
                        <Dialog.Title style={styles.dialogTitle}>Success</Dialog.Title>
                        <Dialog.Content>
                            <Text style={styles.dialogText}>Todo updated successfully</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialog} textColor="#FFC107">
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
        padding: 16,
        backgroundColor: "#002147",
    },
    card: {
        marginBottom: 16,
        borderRadius: 8,
        backgroundColor: "#1E1E1E",
    },
    input: {
        marginBottom: 12,
    },
    updateButton: {
        marginTop: 12,
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    dialog: {
        backgroundColor: "#1E1E1E",
    },
    dialogTitle: {
        color: "#FFC107",
    },
    dialogText: {
        color: "#FFC107",
    },
});

export default TodoDetailScreen;
