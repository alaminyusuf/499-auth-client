import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Axios from 'axios'
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../config'

const initialState = {
  type: 'Expense',
  description: '',
  amount: '',
  
};

const TransactionForm = () => {
  const [formData, setFormData] = useState(initialState);
  const { type, description, amount } = formData;

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const token = await SecureStore.getItemAsync('verifiedToken');
    // 1. Basic Validation
    if (!description || !amount) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    // 2. Prepare the final transaction object
    const newTransaction = {
      type,
      description,
      amount: numericAmount, 
    };

    // In a real app, you would now call your API based on the 'type':
    if (type === 'Income') {
      try {
        const res = await Axios.post(`${API_URL}/staff/add-income`, {source: newTransaction.description, amount: newTransaction.amount}, {headers: { Authorization: `Bearer ${token}`}});
        Alert.alert('Success', `${type} of ${numericAmount.toFixed(2)} added!`);
        setFormData(initialState); 
      } catch (error) {
        return { success: false, message: error.response.data.message || 'failed to add income' };
      }
    } else {
      try {
         const res = await Axios.post(`${API_URL}/staff/add-expense`, {description: newTransaction.description, amount: newTransaction.amount}, {headers: { Authorization: `Bearer ${token}`}});
         Alert.alert('Success', `${type} of ${numericAmount.toFixed(2)} added!`);
         setFormData(initialState); 
      } catch (error) {
        return { success: false, message: error.response.data.message || 'failed to add expense' };
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.form}>
        
        {/* Type Selector (Radio/Toggle) */}
        <View style={styles.typeSelectorContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'Expense' && styles.typeButtonExpense,
            ]}
            onPress={() => handleChange('type', 'Expense')}>
            <Text style={[styles.typeButtonText, type === 'Expense' && styles.typeButtonTextSelected]}>
              Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'Income' && styles.typeButtonIncome,
            ]}
            onPress={() => handleChange('type', 'Income')}>
            <Text style={[styles.typeButtonText, type === 'Income' && styles.typeButtonTextSelected]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <Text style={styles.label}>Amount (N)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter amount"
          value={amount}
          onChangeText={(text) => handleChange('amount', text)}
        />

        {/* Description Input */}
        <Text style={styles.label}>Description/Name</Text>
        <TextInput
          style={styles.input}
          placeholder={`e.g., Coffee, Rent, or Salary`}
          value={description}
          onChangeText={(text) => handleChange('description', text)}
        />

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            type === 'Expense' ? styles.saveButtonExpense : styles.saveButtonIncome,
          ]}
          onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            Add {type}
          </Text>
        </TouchableOpacity>
        
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
    paddingTop: 50
  },
  form: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  
  // --- Type Selector Styles ---
  typeSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
    backgroundColor: '#eee',
    borderRadius: 10,
    padding: 5,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonExpense: {
    backgroundColor: '#e74c3c', // Selected Expense color (Red)
  },
  typeButtonIncome: {
    backgroundColor: '#2ecc71', // Selected Income color (Green)
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  typeButtonTextSelected: {
    color: '#fff',
  },

  // --- Save Button Styles ---
  saveButton: {
    marginTop: 30,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonExpense: {
    backgroundColor: '#c0392b', // Darker Red
  },
  saveButtonIncome: {
    backgroundColor: '#27ae60', // Darker Green
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TransactionForm;