import React from 'react';
import PayrollHistory from "../screens/Admin/PayrollScreen";
import AddEmployee from "../screens/Admin/AddEmployee";
import PaySalaries from "../screens/Admin/AdminPay";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const AdminStack = () => {
  return (
    <Tab.Navigator
    initialRouteName="Dashboard"
    screenOptions={{
      headerShown: false,
    }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={PaySalaries} 
      />
      <Tab.Screen name="View Pay History" component={PayrollHistory} />
      <Tab.Screen name="Add Employee" component={AddEmployee} />
      
    </Tab.Navigator>
  );
};

export default AdminStack;