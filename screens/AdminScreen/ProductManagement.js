import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Image,
  Modal,
} from "react-native";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    rating: 0,
    imageUrl: "",
    carouselImages: [],
  });
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://192.168.0.230:8000/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addProduct = async () => {
    try {
      const response = await axios.post(
        "http://192.168.0.230:8000/products",
        newProduct
      );
      fetchProducts();
      setNewProduct({
        title: "",
        description: "",
        price: 0,
        rating: 0,
        imageUrl: "",
        carouselImages: [],
      });
      setShowPreview(false); // Close the preview modal after adding the product
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const togglePreviewModal = () => {
    setShowPreview(!showPreview);
  };

  const handleUpdateProduct = () => {
    // Implement logic to update the selected product
  };

  const handleDeleteProduct = () => {
    // Implement logic to delete the selected product
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Add New Product:</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={newProduct.title}
        onChangeText={(text) => setNewProduct({ ...newProduct, title: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={newProduct.description}
        onChangeText={(text) =>
          setNewProduct({ ...newProduct, description: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={newProduct.price.toString()}
        onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Image Url"
        value={newProduct.imageUrl.toString()}
        onChangeText={(text) =>
          setNewProduct({ ...newProduct, imageUrl: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="carouselImages"
        value={newProduct.carouselImages.join(", ")}
        onChangeText={(text) =>
          setNewProduct({ ...newProduct, carouselImages: text.split(", ") })
        }
      />
      <Button title="Preview Product" onPress={togglePreviewModal} />
      <Modal
        animationType="slide"
        transparent={false}
        visible={showPreview}
        onRequestClose={togglePreviewModal}
      >
        <View style={styles.previewContainer}>
          <Text style={styles.subtitle}>Product Preview:</Text>
          <Text>Title: {newProduct.title}</Text>
          <Text>Description: {newProduct.description}</Text>
          <Text>Price: ₹{newProduct.price}</Text>
          <Image
            source={{ uri: newProduct.imageUrl }}
            style={{ width: 200, height: 200 }}
          />
          <FlatList
            data={newProduct.carouselImages}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item }}
                  style={{ width: 200, height: 200 }}
                />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
          <Button title="Confirm Add Product" onPress={addProduct} />
          <Button title="Cancel" onPress={togglePreviewModal} />
        </View>
      </Modal>

      <View style={styles.buttonContainer}>
        <View>
        <Button title="Products" onPress={fetchProducts} />
        </View>
        <View>
        <Button title="Update Product" onPress={handleUpdateProduct} />
        </View>
        <View>
        <Button title="Delete Product" onPress={handleDeleteProduct} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    width: "100%",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
});

export default ProductManager;
