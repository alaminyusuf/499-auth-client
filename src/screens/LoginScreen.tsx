import React, { useState } from 'react';
import { View, Text, TextInput, Button,  Alert } from 'react-native';
import { useAuth } from '../auth/Authcontext';

const LoginScreen = ({ navigation }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
     const result = await signIn(email, password,)
     if (!result.success) {
       Alert.alert('Login Error', result.message)
      }
      if(result.success) {
        navigation.navigate('TwoFactor');
      }
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message || 'Login failed' };
    } finally{
      setLoading(false);

    }
  
  }
    


  return (
    <View style={{ flex: 1,
      padding: 20,
      justifyContent: 'center',}}>
      <Text style={{ fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',}}>Login</Text>
      <TextInput
        style={{height: 50,
          borderColor: '#ccc',
          borderWidth: 1,
          marginBottom: 15,
          paddingHorizontal: 10,
          borderRadius: 5,}}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={{height: 50,
          borderColor: '#ccc',
          borderWidth: 1,
          marginBottom: 15,
          paddingHorizontal: 10,
          borderRadius: 5,}}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={loading ? "Login In..." : "Login"} 
        onPress={handleLogin} 
        disabled={loading}  />
      <Button title="Don't have an account? Sign Up" onPress={() => navigation.navigate('Signup')} />
      <Button title="Forgot Password?" onPress={() => navigation.navigate('ForgotPassword')} />
    </View>
  );
};

export default LoginScreen;