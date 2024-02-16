import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import { AntDesign, Feather } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import ProductItem from '../components/ProductItem';

const SearchScreen = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState([]);
    
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get("https://fakestoreapi.com/products");
          setProducts(response.data);
        } catch (error) {
          console.log("error message", error);
        }
      };
  
      fetchData();
    }, []);
  
    const handleSearchQueryChange = (query) => {
      setSearchQuery(query);
    };
  
    const filterProducts = () => {
      return products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    };
  
    return (
      <SafeAreaView
        style={{
          paddingTop: Platform.OS === "android" ? 40 : 0,
          flex: 1,
          backgroundColor: "white",
         
        }}
      >
        <ScrollView>
        <View
        style={{
          backgroundColor: "#3399ff",
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
          
        }}
      >
        <Pressable
        
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 7,
            gap: 10,
            backgroundColor: "white",
            borderRadius: 3,
            height: 38,
            flex: 1,
          }}
        >
          <AntDesign
            style={{ paddingLeft: 10 }}
            name="search1"
            size={22}
            color="black"
          />
          <TextInput
      style={{
        flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 7,
            gap: 10,
            backgroundColor: "white",
            borderRadius: 3,
            height: 38,
            flex: 1,
      }}
      placeholder="Search products"
      value={searchQuery}
      onChangeText={handleSearchQueryChange}
    />
        </Pressable>

        <Feather name="mic" size={24} color="black" />
      </View>
  
          {searchQuery.length >= 1 ? <View style={{ marginTop: 10 }}>
          {filterProducts().map((product) => (
            <ProductItem key={product.id} item={product} />
          ))}
        </View>: <View></View>}
        </ScrollView>
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    height: 38,
    paddingHorizontal: 10,
  },
});

export default SearchScreen;
