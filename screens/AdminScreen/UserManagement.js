import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation()

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://192.168.0.230:8000/admin/users', {
        headers: {
          Authorization: 'Bearer Admin@123',
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://192.168.0.230:8000/admin/users/${userId}`, {
        headers: {
          Authorization: 'Bearer Admin@123',
        },
      });
      // Filter out the deleted user from the state
      setUsers(users.filter((user) => user._id !== userId));
      Alert.alert('Success', 'User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('Error', 'Failed to delete user');
    }
  };

  const renderUserItem = ({ item }) => (
    <View
      style={{
        marginBottom: 20,
        padding: 10,
        backgroundColor: "#bfbfbf",
        borderRadius: 5,
        gap: 5,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>
        {item.name}
      </Text>
      <Text style={{ fontSize: 16, color: "#666" }}>{item.email}</Text>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-around",
          marginTop: 5,
        }}
      >
      <View
      style={{
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: "#33bbff",
        borderRadius: 10,
      }}
    >
      <Button
        title="View"
        onPress={() =>navigation.navigate("UserDetails",{userId:item._id})}
        color="#33bbff"
        style={{ paddingLeft: 10, paddingRight: 10 }}
      />
    </View>
        <View
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            backgroundColor: "#dc3545",
            borderRadius: 10,
          }}
        >
          <Button
            title="Delete"
            onPress={() => confirmDeleteUser(item._id)}
            color="#dc3545"
            style={{ paddingLeft: 10, paddingRight: 10 }}
          />
        </View>
      </View>
    </View>
  );

  const confirmDeleteUser = (userId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this user?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete canceled"),
          style: "cancel",
        },
        { text: "Delete", onPress: () => handleDeleteUser(userId) },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderUserItem}
      />
    </View>
  );
};

export default UserManagement;

const styles = StyleSheet.create({});
