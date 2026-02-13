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
            const response = await axios.put('https://inclusound-back.onrender.com/users/signin', {
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
        backgroundColor: '#06e6f217',
        fontFamily: 'Arial',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        position: 'relative',
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
    login: {
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
    label: {
        marginBottom: 5,
        fontSize: 16,
        color: '#063c3dff',
    },
    bold: {
        fontWeight: 'bold',
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

export default Login;