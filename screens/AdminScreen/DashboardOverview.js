import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign, Feather } from "@expo/vector-icons";
import { FontAwesome5,FontAwesome  } from '@expo/vector-icons';
import axios from 'axios';

const DashboardOverview = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts:0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://192.168.0.230:8000/admin/dashboard');
      const { totalUsers, totalOrders, totalRevenue ,totalProducts} = response.data;
      const revenueTotal = totalRevenue.length > 0 ? totalRevenue[0].total : 0;
      setDashboardData({ totalUsers, totalOrders,totalProducts, totalRevenue: revenueTotal });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };
  

  return (
    <View style={{
      flex: 1,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
      }}>Admin Dashboard Overview</Text>
      <View style={{
        marginBottom: 10,
      }}>
        <Text>Total Users: {dashboardData.totalUsers}</Text>
      </View>
      <View style={{
        marginBottom: 10,
      }}>
        <Text>Total Orders: {dashboardData.totalOrders}</Text>
      </View>
      <View style={{
        marginBottom: 10,
      }}>
        <Text>Total Products : {dashboardData.totalProducts}</Text>
      </View>
      <View style={{
        marginBottom: 10,
      }}>
        <Text>Total Revenue: {dashboardData.totalRevenue}</Text>
      </View> 
    </View>
  );
};

export default DashboardOverview;
