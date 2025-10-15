import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { useAuth } from '../auth/Authcontext';

const ForgotPasswordScreen = ({ navigation }) => {
  const { forgotPassword } = useAuth(); 
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      const result = await forgotPassword(email)
      if(result.success){
        Alert.alert('Success', 'Code sent to mail');
        navigation.navigate('ResetPassword', { email: email });

      } else {
        Alert.alert('Processing', 'Code sent to mail');
      }
    } catch (error) {
      Alert.alert('Request Failed', error.message || 'Failed to send reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1,
      padding: 20,
      justifyContent: 'center',}}>
      <View>
        <Text style={{fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',}}>Forgot Password?</Text>
        <Text>
          Enter your email address and we'll send you a password reset code.
        </Text>

        {/* Email Input */}
        <TextInput
          style={{height: 50,
            borderColor: '#ccc',
            borderWidth: 1,
            marginBottom: 15,
            paddingHorizontal: 10,
            borderRadius: 5,}}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Submit Button */}
        <Button title={loading ? "Sending OTP" : "Send OTP"} 
        onPress={handleForgotPassword} 
        disabled={loading}  />
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen