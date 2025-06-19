import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/Pages/Login';
import Home from './src/Pages/Home';
import Password from './src/Pages/ForgotPassword';
import UserRegistration from './src/Pages/SignUp';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Login'
        screenOptions={{
          headerRight: () => (
            <Image
              source={require('./assets/logo.png')}
              style={{
                width: 300, // aumente o tamanho aqui
                height: 50,
                marginRight: -50, 
                resizeMode: 'cover',

              }}
            />
          ),
          headerTitle: '', // remove o título do meio
          headerStyle: {
            elevation: 0, // Android
            shadowOpacity: 0, // iOS
            borderBottomWidth: 0, // segurança extra
          },
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SingUp" component={UserRegistration} /> 
        <Stack.Screen name="ForgotPassword" component={Password} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// corrigir, pq está com aspas simples e duplas?
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
