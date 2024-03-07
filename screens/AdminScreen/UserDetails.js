import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

const UserDetails = ({ route }) => {
  const { userId } = route.params;
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.230:8000/user/${userId}`
      );
      setUserDetails(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      Alert.alert("Error", "Failed to fetch user details");
    }
  };

  const handleDeleteOrder = async (orderId, authToken) => {
    // Prompt the user for confirmation before deleting the order
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this order?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const config = {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              };

              await axios.delete(
                `http://192.168.0.230:8000/orders/${orderId}`,
                config
              );

              Alert.alert("Success", "Order deleted successfully");
              fetchUserDetails(); // Refetch user details after deleting the order
            } catch (error) {
              console.error("Error deleting order:", error);
              if (error.response) {
                console.log("Server responded with:", error.response.data);
              }
              Alert.alert("Error", "Failed to delete order");
            }
          },
        },
      ]
    );
  };

  if (!userDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading user details...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 20,

        backgroundColor: "#fff",
        flexDirection: "column",
        marginTop: 30,
        marginBottom: 30,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>
        Name: {userDetails.name}
      </Text>
      <Text style={{ fontSize: 16, color: "#666", marginBottom: 10 }}>
        Email: {userDetails.email}
      </Text>
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>Orders:</Text>

      {userDetails.orders.length === 0 ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ fontSize: 16, color: "#666" }}>
            No orders found for this user.
          </Text>
        </View>
      ) : (
        userDetails.orders.map((orders) => (
          
          <View
            key={orders._id}
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 5,
              padding: 10,
              backgroundColor: "#f0f0f0",
              borderRadius: 5,
              gap: 10,
            }}
          >
          
<View style={{display:"flex",flexDirection:"row",width:"100%",justifyContent:"space-between"}}>
<Text></Text>
<Text style={{fontSize:18}}>{new Date(orders.createdAt).toLocaleDateString()}</Text>
</View>
              <Text>
                {orders.products &&
                  orders.products.map((data, id) => (
                    <View key={id}>
                      <View>
                        <Image
                          source={{ uri: data.image }}
                          style={{
                            width: 200,
                            height: 200,
                            resizeMode: "contain",
                          }}
                        />
                      </View>

                      <View>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                          {data.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            color: "green",
                          }}
                        >
                          Price :₹{data.price}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: "#000",
                        }}
                      >
                        paymentMethod :{orders.paymentMethod}
                      </Text>
                      
                    </View>
                  ))}
              </Text>
           

              <TouchableOpacity onPress={() => handleDeleteOrder(orders._id)}
              style={{
               backgroundColor: '#dc3546d2',
               padding: 8,
               borderRadius: 10,
               width:100,
               alignItems: 'center',}}
              >
              <Text style={{fontSize: 14,color:"#fff"}}>Delete</Text>
              </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {display:"flex",justifyContent:"center",alignItems:"center",width:"100%",height: "100%",},
  userName: {},
  userEmail: {},
  orderContainer: {},
});

export default UserDetails;
