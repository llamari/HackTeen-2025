import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showLoginError, setShowLoginError] = useState(false);
    const navigation = useNavigation();
    const { width } = useWindowDimensions();

    async function SignIn() {
        console.log("Está logando"); 
        try {
            const response = await axios.put('http://localhost:5000/signin', {
                email: email,
                password: password 
            });

            console.log(response.data);

            if (response.data.success === true) {
                AsyncStorage.setItem('token', response.data.token);
                navigation.navigate('Home');
            } else {
                setShowLoginError(true);
            }
        } catch (error) {
            console.error(error);
            setShowLoginError(true);
        }
    }

    // Responsive width for form
    const formWidth = width < 480 ? '80%' : '30%';

    return (
        <View style={styles.section}>
            <Text style={styles.title}>LOGIN</Text>
            <View style={[styles.login, { width: formWidth }]}>
                <Text style={styles.label}><Text style={styles.bold}>E-mail:</Text></Text>
                <TextInput
                    style={styles.inputLogin}
                    onChangeText={setEmail}
                    value={email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}><Text style={styles.bold}>Senha:</Text></Text>
                <TextInput
                    style={styles.inputLogin}
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry={true}
                />

                <View style={styles.linksContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={styles.link}>Esqueci a senha</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('SingUp')}>
                        <Text style={styles.link}>Não tenho conta</Text>
                    </TouchableOpacity>
                </View>

                {showLoginError && (
                    <Text style={styles.wrongLogin}>E-mail ou senha inválidos!</Text>
                )}

                <TouchableOpacity style={styles.go} onPress={SignIn}>
                    <Text style={styles.goText}>ENTRAR</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { 
        width: '100%',
        height: '100%',
        backgroundColor: '#FFF',
        fontFamily: 'Arial',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#000',
    },
    login: {
        backgroundColor: '#A2D4DD',
        paddingHorizontal: '5%',
        paddingVertical: '5%',
        borderRadius: 8,
        color: '#000',
        minHeight: 200,
    },
    label: {
        marginBottom: 5,
        color: '#000',
    },
    bold: {
        fontWeight: 'bold',
    },
    inputLogin: {
        height: 40, // 2rem
        backgroundColor: '#fff',
        borderWidth: 0,
        borderRadius: 5,
        width: '100%',
        marginBottom: '5%',
        paddingHorizontal: 10,
    },
    linksContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    link: {
        color: '#000',
        textDecorationLine: 'none',
    },
    wrongLogin: {
        color: 'red',
        marginTop: 10,
    },
    go: {
        backgroundColor: '#5CBBCC',
        width: '100%',
        height: 50, // 3rem
        borderWidth: 0,
        borderRadius: 8, // .5rem
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '2%',
    },
    goText: {
        fontWeight: '600',
        color: '#000',
        fontSize: 18, // large
    },
});

export default Login;