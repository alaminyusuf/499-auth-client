import React from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, Text,  Button, Alert, StyleSheet, ScrollView } from 'react-native';
import Axios  from 'axios';
import { useAuth } from '../../auth/Authcontext';
import { API_URL } from '../../config'
  
  const AdminScreen = () => {
  const {signOut} = useAuth()
  const handlePaySalaries = async () => {
    const token = await SecureStore.getItemAsync('adminToken');
    Alert.alert(
      "Confirm Payroll",
      "Are you sure you want to process payroll for all staff?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Process", onPress: async () => {
            try {  
              const response = await Axios.post(`${API_URL}/admin/pay-salaries`, {
                 cycle: new Date().toLocaleString('default', { month: 'short', year: 'numeric' })
                 }, {headers: { Authorization: `Bearer ${token}`}})
              
              Alert.alert('Payroll Complete', response.data.message);
            } catch (error) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to process payroll.');
            }
          } 
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>

      {/* PAY SALARIES SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Process Payroll</Text>
        <Button 
          title="Pay Staff Salaries" 
          onPress={handlePaySalaries} 
          color="#4CAF50" 
        />
        <Text style={styles.note}>This will process payments and record them in the ledger for the current cycle.</Text>
      </View>
      <View>
        <Button title={"Sign Out"} onPress={signOut} />
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f4f4f8', paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  section: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 20, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 12, paddingHorizontal: 10, borderRadius: 5 },
  note: { marginTop: 10, fontSize: 12, color: '#666' }
});

export default AdminScreen;