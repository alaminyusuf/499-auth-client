import React from 'react';
import Dashboard from "../screens/Staff/Dashboard";
import TransactionForm from "../screens/Staff/TransactionForm";
import TransactionList from "../screens/Staff/TransactionList";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const AppStack = () => {
  return (
    <Tab.Navigator
    initialRouteName="Dashboard"
    screenOptions={{
      headerShown: false,
    }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={Dashboard} 
      />
      <Tab.Screen name="Add Transaction" component={TransactionForm} />
      <Tab.Screen name="Transactions" component={TransactionList} />
      
    </Tab.Navigator>
  );
};

export default AppStack;