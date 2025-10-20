import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../auth/Authcontext';

const AddEmployeeScreen = () => {
  const { addEmployee } = useAuth();

const [employeeData, setEmployeeData] = useState({
  name: '',
  email: '',
  password: '',
  baseSalary: '',
  paymentAccount: '',
});
const [loading, setLoading] = useState(false);

// --- HANDLER 1: ADD NEW EMPLOYEE ---
const handleAddEmployee = async () => {
  if (!employeeData.name || !employeeData.email || !employeeData.password || !employeeData.baseSalary) {
    Alert.alert('Error', 'Please fill all required fields.');
    return;
  }

  try {
    setLoading(true);
   const result = await addEmployee(employeeData)
   if (!result.success) {
     Alert.alert('Login Error', result.message)
    }
    if(result.success) {
      Alert.alert('Success', `${employeeData.name} added successfully.`);
    setEmployeeData({ name: '', email: '', password: '', baseSalary: '', paymentAccount: '',});
    }
    return { success: true };
  } catch (error) {
    Alert.alert('Error', error.response?.data?.message || 'Failed to add employee.');
    return { success: false, message: error.message || 'Login failed' };
  } finally{
    setLoading(false);

  }
};

return (
  <ScrollView style={styles.container}>

  <View style={styles.section}>
  <Text style={styles.sectionTitle}>2. Add New Employee</Text>
  <TextInput
    placeholder="Full Name"
    value={employeeData.name}
    onChangeText={(text) => setEmployeeData({ ...employeeData, name: text })}
    style={styles.input}
    />
  <TextInput
    placeholder="Email (Login ID)"
    value={employeeData.email}
    onChangeText={(text) => setEmployeeData({ ...employeeData, email: text })}
    style={styles.input}
    keyboardType="email-address"
    />
  <TextInput
    placeholder="Initial Password"
    value={employeeData.password}
    onChangeText={(text) => setEmployeeData({ ...employeeData, password: text })}
    style={styles.input}
    secureTextEntry
  />
  <TextInput
    placeholder="Base Salary (e.g., 5000.00)"
    value={employeeData.baseSalary}
    onChangeText={(text) => setEmployeeData({ ...employeeData, baseSalary: text })}
    style={styles.input}
    keyboardType="numeric"
  />
  <TextInput
    placeholder="Payment Account/ID"
    value={employeeData.paymentAccount}
    onChangeText={(text) => setEmployeeData({ ...employeeData, paymentAccount: text })}
    style={styles.input}
    />
  <Button title={loading ? "Adding New Employee" : "ADD EMPLOYEE"}  onPress={handleAddEmployee} color="#2196F3" disabled={loading} />
  </View>
    </ScrollView>
)
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f4f4f8', paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  section: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 20, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 12, paddingHorizontal: 10, borderRadius: 5 },
  note: { marginTop: 10, fontSize: 12, color: '#666' }
});

export default AddEmployeeScreen