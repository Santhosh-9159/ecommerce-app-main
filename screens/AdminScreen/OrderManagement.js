import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Modal, Button, Alert } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import axios from 'axios';

const Tab = createMaterialTopTabNavigator();

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for controlling the modal

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://192.168.0.230:8000/Allorders");
      setOrders(response.data.orders);
    } catch (error) {
      console.log("error message", error);
      Alert.alert('Error', 'Failed to fetch orders');
    }
  };

  
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`http://192.168.0.230:8000/orders/${orderId}/status`, {
        status: newStatus,
      });
      if (response.status === 200) {
        fetchOrders(); // Refetch orders after status update
        Alert.alert('Success', 'Order status updated successfully');
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error.message);
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const OrderList = ({ status }) => {
    const filteredOrders = orders.filter(order => order.status === status);
    
    return (
      <View style={styles.container}>
        
        <FlatList
          style={{ flex: 1 }}
          data={filteredOrders} // Use filteredOrders here
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Text style={styles.orderText}>Order ID: {item._id}</Text>
              <Text style={styles.orderText}>User ID: {item.user}</Text>
              <Text style={styles.orderText}>Status: {item.status}</Text>
              <Text style={styles.orderText}>Total Price: {item.totalPrice}</Text>
              <Text style={styles.orderText}>Ordered at : {new Date(item.createdAt).toLocaleDateString()}</Text>
              <Text style={styles.orderText}>Shipping Address:</Text>
              <Text style={styles.orderText}>Name: {item.shippingAddress.name}</Text>
              <Text style={styles.orderText}>Mobile No: {item.shippingAddress.mobileNo}</Text>
              <Text style={styles.orderText}>House No: {item.shippingAddress.houseNo}</Text>
              <Text style={styles.orderText}>Street: {item.shippingAddress.street}</Text>
              <Text style={styles.orderText}>Landmark: {item.shippingAddress.landmark}</Text>
              <Text style={styles.orderText}>Postal Code: {item.shippingAddress.postalCode}</Text>
              <Text style={styles.orderText}>Products:</Text>
              <FlatList
                data={item.products}
                renderItem={({ item }) => (
                  <View style={styles.productItem}>
                    <Image source={{ uri: item.image }} style={styles.productImage} />
                    <Text style={styles.productText}>Name: {item.name}</Text>
                    <Text style={styles.productText}>Quantity: {item.quantity}</Text>
                    <Text style={styles.productText}>Price: {item.price}</Text>
                  </View>
                )}
                keyExtractor={(item) => item._id}
              />
              <TouchableOpacity
                style={styles.updateButton}
                onPress={() => {
                  setSelectedOrder(item._id);
                  setShowModal(true);
                }} // Pass orderId to handleUpdateStatus
              >
                <Text style={styles.updateButtonText}>Update Status</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator  tabBarOptions={{
        style: {
          backgroundColor: '#196',
        }
      }}>
        <Tab.Screen name="All" component={() => <OrderList status="Order Confrimed" />} />
        <Tab.Screen name="Shipped" component={() => <OrderList status="Shipped" />} />
        <Tab.Screen name="Out of Delivery" component={() => <OrderList status="Out of Delivery" />} />
        <Tab.Screen name="Delivered" component={() => <OrderList status="Delivered" />} padding = {10}/>
      </Tab.Navigator>
      {/* Modal for updating status */}
      <Modal
  visible={showModal}
  animationType="slide"
  transparent={true}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Update Order Status</Text>
      <Button 
        title="Shipped"
        onPress={() => {
          updateOrderStatus(selectedOrder, 'Shipped');
          setShowModal(false); // Close modal
        }}
      />
      <Button
        title="Out of Delivery"
        onPress={() => {
          updateOrderStatus(selectedOrder, 'Out of Delivery');
          setShowModal(false); // Close modal
        }}
      />
      <Button
        title="Delivered"
        onPress={() => {
          updateOrderStatus(selectedOrder, 'Delivered');
          setShowModal(false); // Close modal
        }}
      />
      <Button title="Cancel" onPress={() => setShowModal(false)} />
    </View>
  </View>
</Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  orderItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    gap:5 
  },
  orderText:{
    fontSize:16 
  },
  updateButton: {
    marginTop: 10,
    backgroundColor: '#2089DC',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    gap:10
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  productItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 5,
  },
  productImage: {
    width: 150,
    height: 150,
    
  },
  productText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default OrderManagement;
