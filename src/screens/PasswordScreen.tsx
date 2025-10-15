// src/screens/ResetPasswordScreen.js (This would be navigated to from ForgotPasswordScreen)

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
// Assuming API_BASE_URL is imported

const ResetPasswordScreen = ({ navigation }) => {
    // You might pass the email here from the previous screen, or ask again.
    const [email, setEmail] = useState(''); 
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if (!email || !otp || !newPassword) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }
        setLoading(true);
        
        try {
            const response = await axios.post(`${API_BASE_URL}/reset-password`, {
                email,
                otp,
                newPassword,
            });

            Alert.alert('Success', response.data.message);
            
            // Navigate the user back to the main Login screen
            navigation.navigate('Login'); 

        } catch (error) {
            const message = error.response?.data?.message || 'Failed to reset password.';
            Alert.alert('Reset Failed', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{}}>
            <Text style={{fontSize: 24,
      marginBottom: 20,
      textAlign: 'center'}}>Finalize Password Reset</Text>
            <TextInput style={{height: 50,
          borderColor: '#ccc',
          borderWidth: 1,
          marginBottom: 15,
          paddingHorizontal: 10,
          borderRadius: 5,}} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <TextInput style={{height: 50,
          borderColor: '#ccc',
          borderWidth: 1,
          marginBottom: 15,
          paddingHorizontal: 10,
          borderRadius: 5,}} placeholder="6-Digit Code (from email)" value={otp} onChangeText={setOtp} keyboardType="numeric" maxLength={6} />
            <TextInput style={{height: 50,
          borderColor: '#ccc',
          borderWidth: 1,
          marginBottom: 15,
          paddingHorizontal: 10,
          borderRadius: 5,}} placeholder="New Password" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
            <Button title={loading ? "Updating..." : "Set New Password"} onPress={handleReset} disabled={loading} />
        </View>
    );
};
// ... (Styles)
export default ResetPasswordScreen;