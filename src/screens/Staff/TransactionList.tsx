import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  ScrollView,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Axios from 'axios'
import { API_URL } from '../../config'

const TransactionListScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    const token = await SecureStore.getItemAsync('verifiedToken');
    setRefreshing(true); 
    setError(null);
    try {
      const res = await Axios.get(`${API_URL}/staff/get-transactions`,{
					
        headers: { Authorization: `Bearer ${token}`}
      } )
      const data = res.data
      // 1. Combine Income and Expenses into one list
      const combined = [
        ...data.income.map(item => ({ ...item, type: 'Income', isExpense: false })),
        ...data.expenses.map(item => ({ ...item, type: 'Expense', isExpense: true })),
      ];

      // 2. Sort by date (assuming a 'createdAt' or similar field exists)
      combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setTransactions(combined);
    } catch (err) {
      setError('Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // --- List Item Renderer ---
  const renderItem = ({ item }) => {
    // Determine the main label and style based on transaction type
    const amountStyle = item.isExpense ? styles.expenseAmount : styles.incomeAmount;
    const typeLabel = item.isExpense ? 'Expense' : 'Income';
    
    // Use 'source' for income or 'description' for expense category/source
    const detail = item.isExpense ? item.description : item.source;

    // Helper for date formatting (optional)
    const formattedDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A';

    return (
      <View style={styles.transactionItem}>
        <View style={styles.textContainer}>
          <Text style={styles.descriptionText}>{item.description}</Text>
          <Text style={styles.detailText}>
            {typeLabel} • {detail}
          </Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
        <Text style={amountStyle}>
          {item.isExpense ? '-' : '+'}${item.amount.toFixed(2)}
        </Text>
      </View>
    );
  };

  // --- Loading/Error/Empty State ---
  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.statusText}>Loading transactions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.statusTextError}>{error}</Text>
      </View>
    );
  }

  if (transactions.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.statusText}>No transactions recorded yet.</Text>
      </View>
    );
  }

  // --- Main List View ---
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchTransactions} />
        }>

      <Text style={styles.header}>Transaction History</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item._id} // Assuming Mongoose provides an _id
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchTransactions} />
        }
        />
        </ScrollView>
    </SafeAreaView>
  );
};

// --- Styling ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 35
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 15,
    textAlign: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    marginBottom: 5,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  textContainer: {
    flexShrink: 1, // Allows the text to wrap
  },
  descriptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  detailText: {
    fontSize: 10,
    color: '#777',
    marginTop: 2,
  },
  dateText: {
    fontSize: 8,
    color: '#aaa',
    marginTop: 5,
  },
  incomeAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#27ae60', // Green for income
  },
  expenseAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#c0392b', // Red for expense
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  statusTextError: {
    marginTop: 10,
    fontSize: 16,
    color: 'red',
  }
});

export default TransactionListScreen;