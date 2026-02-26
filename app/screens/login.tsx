import { useState } from "react";
import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from 'react-native-paper';

export default function Login({ setIsAuthenticated }: { readonly setIsAuthenticated: (isAuthenticated: boolean) => void }) {
    let [username, setUsername] = useState<string>('');
    let [password, setPassword] = useState<string>('');

    const loginText = 'Log in';

    const handleLogin = () => {
        if (password.length === 0 || username.length === 0) {
            alert('Please enter both username and password.');
        }
        else if (username === 'admin' && password === 'test') {
            alert('Successfully logged in!');
            setIsAuthenticated(true);
        }
        else {
            alert('Invalid username or password.');
        }
    };

    return (
        <>
            <View style={styles.spacer}><Text style={styles.headerText}>Black's App</Text></View>
            <KeyboardAvoidingView style={styles.container}>

                <View style={styles.card}>
                    <Text style={styles.loginText}>Log in</Text>

                    <TextInput
                        value={username}
                        onChangeText={setUsername}
                        style={styles.textInput}
                        placeholder="Username"
                    />
 
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        style={styles.textInput}
                        placeholder="Password"
                        secureTextEntry
                    />

                    <Button
                        disabled={!username || !password}
                        mode="contained"
                        onPress={handleLogin} 
                        children={loginText}
                    />
                </View>
            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#313639",
    },
    card: {
        width: "85%",
        backgroundColor: "white",
        marginTop: 40,
        padding: 20,
        borderRadius: 20,
    },
    headerText: {
        fontSize: 32,
        fontWeight: "bold",
        color: '#598BAF',
        marginVertical: 10,
        marginStart: 10
    },
    loginText: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    textInput: {
        marginBottom: 15,
        borderRadius: 10,
    },
    spacer: {
        height: 'auto',
        backgroundColor: '#191C27',
        justifyContent: 'center',
    },
})