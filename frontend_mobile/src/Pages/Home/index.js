import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { Audio } from 'expo-av';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

function Home() {
    const [token, setToken] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [sound, setSound] = useState(null);
    const [text, setText] = useState("");
    const [language, setLanguage] = useState("pt-br");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getToken = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            setToken(storedToken);
        };
        getToken();
    }, []);

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    async function playSound() {
        if (audioUrl) {
            const { sound } = await Audio.Sound.createAsync(
                { uri: audioUrl },
                { shouldPlay: true }
            );
            setSound(sound);
            await sound.playAsync();
        }
    }

    async function TextToSpeach(texto) {
        setIsLoading(true);
        setError(null);

        try {
             const response = await axios.post(
                'https://inclusound-back.onrender.com/tts',
                { text: texto, language },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    responseType: 'arraybuffer'
                }
            );

            const audioBlob = new Blob([response.data], { type: 'audio/mp3' });
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
            playSound();

        } catch (err) {
            console.error("Erro:", err); 
            setError(err.response?.data?.error || 'Erro ao gerar áudio');
        } finally {
            setIsLoading(false);
        }
    }

    async function Summary() {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axios.post(
                'https://inclusound-back.onrender.com/tts/summarize',
                { text: text },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const summary = response.data.summary;
            TextToSpeach(summary);
        } catch (err) {
            console.error("Erro:", err);
            setError(err.response?.data?.error || 'Erro ao gerar resumo');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <View style={styles.main}>
            <View style={styles.content}>
                <ScrollView style={styles.formTts}>
                    <Text style={styles.label}>Escolha o idioma do seu texto: </Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={language}
                            style={styles.picker}
                            onValueChange={(itemValue) => setLanguage(itemValue)}
                        >
                            <Picker.Item label="Africâner (af)" value="af" />
                            <Picker.Item label="Albanês (sq)" value="sq" />
                            <Picker.Item label="Árabe (ar)" value="ar" />
                            <Picker.Item label="Armênio (hy)" value="hy" />
                            <Picker.Item label="Catalão (ca)" value="ca" />
                            <Picker.Item label="Chinês (zh)" value="zh" />
                            <Picker.Item label="Chinês (China) (zh-cn)" value="zh-cn" />
                            <Picker.Item label="Chinês (Taiwan) (zh-tw)" value="zh-tw" />
                            <Picker.Item label="Cantonês (zh-yue)" value="zh-yue" />
                            <Picker.Item label="Croata (hr)" value="hr" />
                            <Picker.Item label="Tcheco (cs)" value="cs" />
                            <Picker.Item label="Dinamarquês (da)" value="da" />
                            <Picker.Item label="Holandês (nl)" value="nl" />
                            <Picker.Item label="Inglês (en)" value="en" />
                            <Picker.Item label="Inglês (Austrália) (en-au)" value="en-au" />
                            <Picker.Item label="Inglês (Reino Unido) (en-uk)" value="en-uk" />
                            <Picker.Item label="Inglês (EUA) (en-us)" value="en-us" />
                            <Picker.Item label="Esperanto (eo)" value="eo" />
                            <Picker.Item label="Finlandês (fi)" value="fi" />
                            <Picker.Item label="Francês (fr)" value="fr" />
                            <Picker.Item label="Alemão (de)" value="de" />
                            <Picker.Item label="Grego (el)" value="el" />
                            <Picker.Item label="Crioulo Haitiano (ht)" value="ht" />
                            <Picker.Item label="Hindi (hi)" value="hi" />
                            <Picker.Item label="Húngaro (hu)" value="hu" />
                            <Picker.Item label="Islandês (is)" value="is" />
                            <Picker.Item label="Indonésio (id)" value="id" />
                            <Picker.Item label="Italiano (it)" value="it" />
                            <Picker.Item label="Japonês (ja)" value="ja" />
                            <Picker.Item label="Coreano (ko)" value="ko" />
                            <Picker.Item label="Latim (la)" value="la" />
                            <Picker.Item label="Letão (lv)" value="lv" />
                            <Picker.Item label="Macedônio (mk)" value="mk" />
                            <Picker.Item label="Norueguês (no)" value="no" />
                            <Picker.Item label="Polonês (pl)" value="pl" />
                            <Picker.Item label="Português (pt)" value="pt" />
                            <Picker.Item label="Português (Brasil) (pt-br)" value="pt-br" />
                            <Picker.Item label="Romeno (ro)" value="ro" />
                            <Picker.Item label="Russo (ru)" value="ru" />
                            <Picker.Item label="Sérvio (sr)" value="sr" />
                            <Picker.Item label="Eslovaco (sk)" value="sk" />
                            <Picker.Item label="Espanhol (es)" value="es" />
                            <Picker.Item label="Espanhol (Espanha) (es-es)" value="es-es" />
                            <Picker.Item label="Espanhol (EUA) (es-us)" value="es-us" />
                            <Picker.Item label="Suaíli (sw)" value="sw" />
                            <Picker.Item label="Sueco (sv)" value="sv" />
                            <Picker.Item label="Tâmil (ta)" value="ta" />
                            <Picker.Item label="Tailandês (th)" value="th" />
                            <Picker.Item label="Turco (tr)" value="tr" />
                            <Picker.Item label="Vietnamita (vi)" value="vi" />
                            <Picker.Item label="Galês (cy)" value="cy" />
                        </Picker>
                    </View>

                    <Text style={styles.label}>Texto: </Text>
                    <TextInput
                        style={styles.textInput}
                        value={text}
                        onChangeText={setText}
                        multiline
                        numberOfLines={10}
                        textAlignVertical="top"
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={[styles.button, (isLoading || !text) && styles.disabledButton]} 
                            onPress={() => TextToSpeach(text)} 
                            disabled={isLoading || !text}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#000" />
                            ) : (
                                <Text style={styles.buttonText}>Ouvir áudio</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[styles.button, isLoading && styles.disabledButton]} 
                            onPress={Summary}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#000" />
                            ) : (
                                <Text style={styles.buttonText}>Ouvir áudio do resumo</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {error && <Text style={styles.errorText}>{error}</Text>}
                </ScrollView>
            </View>

            {audioUrl && (
                <View style={styles.audioContainer}>
                    <TouchableOpacity style={styles.playButton} onPress={playSound}>
                        <Text style={styles.playButtonText}>Reproduzir áudio</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        padding: 20,
    },
    content: {
        width: '100%',
        height: '70%',
        backgroundColor: '#A2D4DD',
        borderRadius: 15,
        marginBottom: 20,
    },
    formTts: {
        padding: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#000',
        fontWeight: 'bold',
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    textInput: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        minHeight: 150,
        marginBottom: 16,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#5CBBCC',
        borderRadius: 16,
        padding: 12,
        flex: 1,
        marginHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#000',
        fontWeight: '600',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 8,
    },
    audioContainer: {
        marginTop: 16,
    },
    playButton: {
        backgroundColor: '#5CBBCC',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
    },
    playButtonText: {
        color: '#000',
        fontWeight: '600',
    },
});

export default Home;