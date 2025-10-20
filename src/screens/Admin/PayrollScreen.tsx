import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert, ScrollView , RefreshControl} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import  Axios  from 'axios';
import { API_URL } from '../../config'
import { SafeAreaView } from 'react-native-safe-area-context';

const PayrollHistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    const token = await SecureStore.getItemAsync('adminToken');
    try {
     
      const response = await Axios(`${API_URL}/admin/view-pay-history`,{headers: { Authorization: `Bearer ${token}`}});
      setHistory(response.data);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to fetch payroll history.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const renderItem = ({ item }) => (
    <ScrollView >

    <View style={styles.item}>
      <Text style={styles.payCycle}>{item.paymentCycle}</Text>
      <Text>
        <Text style={styles.label}>Employee:</Text> {item.employee.name} ({item.employee.email})
      </Text>
      <Text>
        <Text style={styles.label}>Net Pay:</Text> ${item.netPay.toFixed(2)}
      </Text>
      <Text>
        <Text style={styles.label}>Gross Pay:</Text> ${item.grossPay.toFixed(2)}
      </Text>
      <Text style={{ color: item.status === 'RECORDED' ? 'green' : 'red' }}>
        Status: {item.status}
      </Text>
      <Text style={styles.dateText}>Date: {new Date(item.paymentDate).toLocaleDateString()}</Text>
    </View>
  </ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Payroll Data...</Text>
      </View>
    );
  }

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Payroll History Ledger</Text>
        <FlatList
          data={history}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>No payroll records found.</Text>}
          />
      </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop:50 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#f9f9f9', marginBottom: 8, borderRadius: 5 },
  payCycle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  label: { fontWeight: '600', color: '#555' },
  dateText: { fontSize: 11, color: '#999', marginTop: 5 },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' }
});

export default PayrollHistoryScreen;