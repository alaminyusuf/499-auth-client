import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import { useAuth } from '../auth/Authcontext';

const SignupScreen = ({ navigation }) => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {    
    try {
        setIsLoading(true);
       const result = await signUp(email, password, username)
       if (!result.success) {
         Alert.alert('Sign Up Error', result.message)
        }
        if(result.success){

          navigation.navigate('Login');
        }
        return {success: true}
        
      } catch (error) {
       
        return { success: false, message: error.message || 'Signup failed' };
      }
      finally {
        setIsLoading(false);
      }

  };

  return (
    <View style={{ flex: 1,
      padding: 20,
      justifyContent: 'center', }}>
       <Text style={{ fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',}}>Sign Up</Text>
      <TextInput
        style={{height: 50,
          borderColor: '#ccc',
          borderWidth: 1,
          marginBottom: 15,
          paddingHorizontal: 10,
          borderRadius: 5,}}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        keyboardType="ascii-capable"
        autoCapitalize="none"
      />
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
      <Button 
        title={isLoading ? "Signing Up..." : "Sign Up"} 
        onPress={handleSignup} 
        disabled={isLoading} 
      />
    </View>
  );
};
export default SignupScreen;