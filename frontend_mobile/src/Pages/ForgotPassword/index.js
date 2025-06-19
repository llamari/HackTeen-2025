import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useWindowDimensions, ScrollView } from "react-native";
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";

function Password() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentStep, setCurrentStep] = useState(1); // 1: email, 2: code, 3: new password, 4: success
    const [error, setError] = useState("");
    const navigation = useNavigation();
    const { width } = useWindowDimensions();

    async function handleSendEmail() {
        try {
            console.log("E-mail do usuário: ", email);
            
            const response = await axios.put(`http://localhost:5000/forgot/password`, {
                email: email
            });

            console.log(response.data);
            setCurrentStep(2);
            setError("");
        } catch (error) {
            console.error("Erro ao enviar requisição: ", error);
            setError("Erro ao enviar e-mail. Verifique o endereço e tente novamente.");
        }
    }

    async function handleVerifyCode() {
        try {
            console.log(code);
            const response = await axios.put("http://localhost:5000/verify/code", {
                code: code, 
                email: email
            });

            console.log(response.data);
            setCurrentStep(3);
            setError("");
        } catch (error) {
            console.error("Erro: ", error);
            setError("Código inválido. Por favor, tente novamente.");
        }
    }

    async function handleChangePassword() {
        if (password !== confirmPassword) {
            setError("As senhas devem ser iguais");
            return;
        }

        try {
            await axios.put("http://localhost:5000/new/password", {
                password: password, 
                email: email
            });
            
            setCurrentStep(4);
            setError("");
        } catch (error) {
            console.error("Erro ao alterar senha: ", error);
            setError("Erro ao alterar senha. Tente novamente.");
        }
    }

    // Responsive width for form
    const formWidth = width < 480 ? '80%' : '30%';

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Step 1: Email Input */}
            {currentStep === 1 && (
                <View style={[styles.formForgot, { width: formWidth }]}>
                    <Text style={styles.title}>Esqueci a senha</Text>
                    <Text style={styles.text}>Digite seu e-mail no campo abaixo e lhe enviaremos um código de ativação para redefinição da senha</Text>
                    
                    <Text style={styles.label}>Insira seu e-mail</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setEmail}
                        value={email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    
                    <TouchableOpacity style={styles.sendButton} onPress={handleSendEmail}>
                        <Text style={styles.sendButtonText}>Enviar</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Step 2: Code Verification */}
            {currentStep === 2 && (
                <View style={[styles.formForgot, { width: formWidth }]}>
                    <Text style={styles.title}>Insira o código</Text>
                    <Text style={styles.text}>Insira no campo abaixo o código enviado no seu e-mail:</Text>
                    <Text style={styles.text}>Se não encontrar o e-mail na sua caixa de entrada, verifique a pasta de spam ou lixo eletrônico.</Text>
                    
                    <TextInput
                        style={styles.input}
                        onChangeText={setCode}
                        value={code}
                        keyboardType="numeric"
                        placeholder="Código de verificação"
                    />
                    
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    
                    <TouchableOpacity style={styles.sendButton} onPress={handleVerifyCode}>
                        <Text style={styles.sendButtonText}>Verificar</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Step 3: New Password */}
            {currentStep === 3 && (
                <View style={[styles.formForgot, { width: formWidth }]}>
                    <Text style={styles.title}>Redefina sua senha:</Text>
                    
                    <Text style={styles.label}>Insira sua senha:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry
                    />
                    
                    <Text style={styles.label}>Repita sua senha:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setConfirmPassword}
                        value={confirmPassword}
                        secureTextEntry
                    />
                    
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    
                    <TouchableOpacity style={styles.sendButton} onPress={handleChangePassword}>
                        <Text style={styles.sendButtonText}>Enviar</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Step 4: Success */}
            {currentStep === 4 && (
                <View style={[styles.formForgot, { width: formWidth, alignItems: 'center' }]}>
                    <Text style={styles.title}>Nova senha definida com sucesso!</Text>
                    <TouchableOpacity style={styles.sendButton} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.sendButtonText}>Ir para o login</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 20,
    },
    formForgot: {
        backgroundColor: '#A2D4DD',
        borderRadius: 32, // 2rem
        padding: 20, // 0 5% 5% 5%
        color: '#000',
        alignItems: 'center',
        minHeight: 200, // 30% min-height
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#000',
    },
    text: {
        textAlign: 'center',
        marginBottom: 10,
        color: '#000',
    },
    label: {
        alignSelf: 'flex-start',
        marginTop: 10,
        marginBottom: 5,
        color: '#000',
    },
    input: {
        height: 40, // 1.5rem
        backgroundColor: '#fff',
        borderWidth: 0,
        borderRadius: 5,
        width: '100%',
        marginVertical: 5, // .2rem 0
        paddingHorizontal: 10,
    },
    sendButton: {
        width: '100%',
        height: 50, // 2.5rem
        borderRadius: 16, // 1rem
        backgroundColor: '#5CBBCC',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10, // 2% 0 0 0
    },
    sendButtonText: {
        fontWeight: '600',
        color: '#000',
        fontSize: 18, // large
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
});

export default Password;