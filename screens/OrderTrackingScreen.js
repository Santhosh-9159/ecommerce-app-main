import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, ScrollView, Button, Image } from 'react-native';
import axios from 'axios';
import { UserType } from '../UserContext';

const OrderTrackingScreen = ({ route }) => {
  const { userId } = useContext(UserType); // Assuming you pass the userId from the navigation

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user orders from the backend
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://192.168.0.230:8000/orders/${userId}`);
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const navigateToOrderTracking = (orderId) => {
    // Navigate to a new screen where you can update the order status
    // For simplicity, you can use React Navigation or any other navigation library.
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16, flex: 1, marginTop: 75, padding: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Order Tracking
      </Text>

      {orders.length === 0 ? (
        <Text>No orders found for this user.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 16 }}>

            <Image
            source={{ uri: item.image }}
            style={{ width: 100, height: 100, resizeMode: "contain" }}
          />
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                Order ID: {item._id}
              </Text>

                
              <Text>Status: {item.status}</Text>
              {/* Display other order details as needed */}
              <Button
                title="Track Order"
                onPress={() => navigateToOrderTracking(item._id)}
              />
              <View>
              <Button title='Cancel Order '/>
              </View>
              
            </View>
          )}
        />
        
      )}
      
    </ScrollView>
  );
};

export default OrderTrackingScreen;

