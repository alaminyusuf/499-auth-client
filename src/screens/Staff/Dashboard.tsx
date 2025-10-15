import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Button
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Axios from 'axios'
import { API_URL } from '../../config'
import { useAuth } from '../../auth/Authcontext';



const DashboardScreen = () => {
  const {signOut} = useAuth()
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const token = await SecureStore.getItemAsync('verifiedToken');
    setRefreshing(true);
    setError(null);
    try {
      const res = await Axios.get(`${API_URL}/staff/get-summary`,{
					
        headers: { Authorization: `Bearer ${token}`}
      } )
      const data = res.data
      setSummary({
        totalIncome: data.totalIncome || 0,
        totalExpenses: data.totalExpenses || 0,
      });
    } catch (err) {
      setError('Could not connect to server or load data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate Net Balance
  const netBalance = summary.totalIncome - summary.totalExpenses;

  // Determine the style for the Net Balance card
  const netBalanceStyle =
    netBalance >= 0 ? styles.balanceCardPositive : styles.balanceCardNegative;

  // --- Loading/Error States ---
  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.statusText}>Loading financial summary...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.statusText}>Pull down to refresh.</Text>
      </View>
    );
  }

  // --- Main Dashboard View ---
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
        }>
        <Text style={styles.header}>Financial Overview</Text>

        {/* 1. Net Balance Card (Main Metric) */}
        <View style={[styles.balanceCard, netBalanceStyle]}>
          <Text style={styles.balanceLabel}>NET BALANCE</Text>
          <Text style={styles.balanceValue}>
            {netBalance.toFixed(2)}
          </Text>
        </View>

        {/* 2. Income and Expense Cards */}
        <View style={styles.metricsContainer}>
          {/* Income Card */}
          <View style={[styles.metricCard, styles.incomeCard]}>
            <Text style={styles.metricLabel}>Total Income</Text>
            <Text style={styles.metricValue}>
              +N{summary.totalIncome.toFixed(2)}
            </Text>
          </View>

          {/* Expense Card */}
          <View style={[styles.metricCard, styles.expenseCard]}>
            <Text style={styles.metricLabel}>Total Expense</Text>
            <Text style={styles.metricValue}>
              -N{summary.totalExpenses.toFixed(2)}
            </Text>
          </View>
        </View>

        <View>
        <Button title={"Sign Out"} onPress={signOut} />
        </View>
        
        {/* Call to action or space for other components (e.g., charts)
        <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
                Dashboard details go here (e.g., Monthly chart, Top categories)
            </Text>
        </View> */}

      </ScrollView>
      
    </SafeAreaView>
  );
};

// --- Styling ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingTop: 35
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  // --- Net Balance Card ---
  balanceCard: {
    padding: 25,
    borderRadius: 15,
    marginBottom: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  balanceCardPositive: {
    backgroundColor: '#2ecc71', // Green
  },
  balanceCardNegative: {
    backgroundColor: '#e74c3c', // Red
  },
  balanceLabel: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  balanceValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    marginTop: 5,
  },

  // --- Metric Cards ---
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  metricCard: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  incomeCard: {
    backgroundColor: '#d1f4e3', // Light Green
    borderLeftWidth: 5,
    borderLeftColor: '#27ae60',
  },
  expenseCard: {
    backgroundColor: '#fddddd', // Light Red
    borderLeftWidth: 5,
    borderLeftColor: '#c0392b',
  },
  metricLabel: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 5,
  },

  // --- Utility Styles ---
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  placeholder: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    padding: 30,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  placeholderText: {
      color: '#aaa',
      fontSize: 14,
      textAlign: 'center',
  }
});

export default DashboardScreen;