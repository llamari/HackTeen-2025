import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";

function UserRegistration() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPasswordError, setShowPasswordError] = useState(false);
    const [showEmailError, setShowEmailError] = useState(false);
    const navigation = useNavigation();
    const { width } = useWindowDimensions();

    async function SignUp() {
        if (password === confirmPassword) {
            try {
                console.log("As senhas são iguais")
                const response = await axios.post('https://inclusound-back.onrender.com/users/signup', {
                    email: email,
                    password: password
                });

                console.log(response.data);

                if (response.data.success === true) {
                    // AsyncStorage.setItem('token', response.data.token);
                    navigation.navigate('Home');
                } else {
                    setShowEmailError(true);
                }
            } catch (error) {
                console.error(error);
                setShowEmailError(true);
            }
        } else {
            setShowPasswordError(true);
        }
    }

    // Responsive width for form
    const formWidth = width < 480 ? '80%' : '30%';

    return (
        <View style={styles.section}>
            <Text style={styles.title}>CADASTRO</Text>
            <View style={[styles.registrationForm, { width: formWidth }]}>
                <Text style={styles.label}>E-mail:</Text>
                <TextInput
                    style={styles.inputLogin}
                    onChangeText={setEmail}
                    value={email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Senha:</Text>
                <TextInput
                    style={styles.inputLogin}
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry={true}
                />

                <Text style={styles.label}>Confirme sua senha:</Text>
                <TextInput
                    style={styles.inputLogin}
                    onChangeText={setConfirmPassword}
                    value={confirmPassword}
                    secureTextEntry={true}
                />

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.link}>Já tenho conta</Text>
                </TouchableOpacity>

                {showPasswordError && (
                    <Text style={styles.errorText}>As senhas devem ser iguais!</Text>
                )}
                {showEmailError && (
                    <Text style={styles.errorText}>Já existe uma conta com esse e-mail!</Text>
                )}

                <TouchableOpacity style={styles.go} onPress={SignUp}>
                    <Text style={styles.goText}>CADASTRAR</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        width: '100%',
        height: '100%',
        backgroundColor: '#06e6f217',
        fontFamily: 'Arial',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        position: 'relative',
    },
    registrationForm: { // corrigir
        backgroundColor: '#A2D4DD',
        paddingHorizontal: '5%',
        paddingVertical: '5%',
        borderRadius: 8,
        color: '#000',
        minHeight: 350,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 28,
        color: '#08696B',
        position: 'absolute',
        top: 70,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 16,
        color: '#063c3dff',
    },
    inputLogin: {
        backgroundColor: '#d9d9d9',
        height: 35,
        borderRadius: 5,
        display: 'flex',
        alignItems: 'center',
        padding: 5,
        marginBottom: 15,
    },
    link: {
        color: '#000',
        textDecorationLine: 'none',
        marginTop: 10,
        marginBottom: 20,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        marginTop: 5,
        display: 'flex',
    },
    go: {
        backgroundColor: '#137F83',
        width: '100%',
        height: 40,
        border: 'none',
        borderRadius: 24,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    goText: {
        fontWeight: '600',
        color: '#fff',
        fontSize: 18, // large
    },
});

export default UserRegistration; // corrigir