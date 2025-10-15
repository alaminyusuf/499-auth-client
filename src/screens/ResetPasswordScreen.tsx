import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert,  SafeAreaView } from 'react-native';
import { useAuth } from '../auth/Authcontext';

const ResetPasswordScreen = ({ route, navigation }) => {
  const { resetPassword } = useAuth()
  const initialEmail = route.params?.email || ''; 
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email || !otp || !newPassword) {
      Alert.alert('Error', 'Please fill in all fields (Email, Code, and New Password).');
      return;
    }
    if (newPassword.length < 6) {
        Alert.alert('Error', 'New password must be at least 6 characters.');
        return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(email, otp, newPassword);

      if (result.success) {
        Alert.alert('Success', 'Password Changed')
        navigation.navigate('Login');
      } else{
         Alert.alert('Sign Up Error', result.message)
       } 
    } catch (error) {
      Alert.alert('Reset Failed', error.message || 'Password reset failed.');
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
      textAlign: 'center'}}>Enter Reset Code</Text>
        <Text style={{fontSize: 20,
      marginBottom: 20,
      textAlign: 'center'}}>
          Check your email for the 6-digit code. Enter it below to set a new password.
        </Text>

        {/* Email Input (Can be disabled if passed via route) */}
        <TextInput
          style={{height: 50,
            borderColor: '#ccc',
            borderWidth: 1,
            marginBottom: 15,
            paddingHorizontal: 10,
            borderRadius: 5,}}
          placeholder="Email (required)"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={!route.params?.email} // Allow editing if email wasn't passed from prev screen
        />

        {/* OTP Input */}
        <TextInput
          style={{height: 50,
            borderColor: '#ccc',
            borderWidth: 1,
            marginBottom: 15,
            paddingHorizontal: 10,
            borderRadius: 5,}}
          placeholder="6-Digit Reset Code"
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
        />

        {/* New Password Input */}
        <TextInput
          style={{height: 50,
            borderColor: '#ccc',
            borderWidth: 1,
            marginBottom: 15,
            paddingHorizontal: 10,
            borderRadius: 5,}}
          placeholder="New Password (min 6 chars)"
          secureTextEntry
          autoCapitalize="none"
          value={newPassword}
          onChangeText={setNewPassword}
        />

        {/* Reset Button */}
        <Button title={loading ? "Submitting" : "Submit"} 
        onPress={handleResetPassword} 
        disabled={loading}  />
      </View>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen