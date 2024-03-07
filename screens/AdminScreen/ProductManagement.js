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
  Pressable,
  Alert,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    name: "",
    description: "",
    price: "",
    rating: 0,
    image: "",
    carouselImages: [],
  });
  const [showPreview, setShowPreview] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState({
    title: "",
    name: "",
    description: "",
    price: "",
    rating: 0,
    image: "",
    carouselImages: [],
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
 

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
        name: "",
        description: "",
        price: 0,
        rating: 0,
        image: "",
        color:"",
        Size:"",
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

  const toggleProductModal = () => {
    setShowProductModal(!showProductModal);
  };



  const handleUpdateProduct = async () => {
    try {
      const response = await axios.put(
        `http://192.168.0.230:8000/products/${selectedProduct._id}`,updatedProduct
        
      );
      if (response.data.error) {
        // Handle the case where the product was not found
        console.error(response.data.error);
        return;
      }
      // Update the product list after successful update
      fetchProducts();
      setSelectedProduct(null);

      // Close the update form modal
      setShowUpdateForm(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  
  const handleDeleteProduct = async () => {
    try {
      const response = await axios.delete(
        `http://192.168.0.230:8000/products/${selectedProduct._id}`
      );
      if (response.data.error) {
        // Handle the case where the product was not found
        console.error(response.data.error);
        return;
      }
      // Update the product list after successful deletion
      fetchProducts();
      // Close the delete confirmation modal
      setShowDeleteConfirmation(false);
      // Clear the selected product
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleUpdateButtonClick = () => {
  
    setUpdatedProduct(selectedProduct);

    setShowUpdateForm(true);
  };

  const confirmUpdate = () => {
    Alert.alert(
      "Confirm Update",
      "Are you sure you want to update this product?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Update canceled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            // Logic to update the product
            handleUpdateProduct();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const confirmDdelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to Delete this product?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete canceled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            // Logic to update the product
            handleDeleteProduct();
          },
        },
      ],
      { cancelable: false }
    );
  };

  
    const [searchQuery, setSearchQuery] = useState("");
    
    
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get("http://192.168.0.230:8000/products");
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
    
    <View style={styles.container}>
   
    <Text style={ {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
      paddingLeft:20
    }}>Add New Product:</Text>
    <View style={{
      marginTop:10,
      padding: 10,
    
      borderRadius: 5,
      gap: 5,
      justifyContent:"center",
      backgroundColor: "#f0f0f0"
    }}>
    <TextInput
    style={styles.input}
    placeholder="Title"
    value={newProduct.title}
    onChangeText={(text) => setNewProduct({ ...newProduct, title: text })}
  />
  <TextInput
    style={styles.input}
    placeholder="Name"
    value={newProduct.name}
    onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
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
    placeholder="color"
    value={newProduct.color}
    onChangeText={(text) =>
      setNewProduct({ ...newProduct, color: text })
    }
  />
  <TextInput
    style={styles.input}
    placeholder="size"
    value={newProduct.Size}
    onChangeText={(text) =>
      setNewProduct({ ...newProduct, Size: text })
    }
  />
  <TextInput
    style={styles.input}
    placeholder="Image Url"
    value={newProduct.image.toString()}
    onChangeText={(text) =>
      setNewProduct({ ...newProduct, image: text })
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
  <Button title="Preview Product"color="#33bbff" onPress={togglePreviewModal} />
    </View>
  <Modal
    animationType="slide"
    transparent={false}
    visible={showPreview}
    onRequestClose={togglePreviewModal}
  >
 <ScrollView>
 <View  style={{
  marginTop:5,
  padding: 10,
  
  borderRadius: 5,
  gap: 5,
  justifyContent:"center",
  backgroundColor: "#f0f0f0"
}}>
 
  <Text style={ {
    fontSize: 18,
    
    marginBottom: 10,
  }}>Title: {newProduct.title}</Text>
  <Text style={ {
    fontSize: 18,
  
    marginBottom: 10,
  }}>Name: {newProduct.name}</Text>
  <Text style={ {
    fontSize: 18,
    
    marginBottom: 10,
  }}>Description: {newProduct.description}</Text>
  <Text style={ {
    fontSize: 18,
    
    marginBottom: 10,
  }}>Price: ₹{newProduct.price}</Text>
   
  <Text style={ {
    fontSize: 18,
    
    marginBottom: 10,
  }}>color: {newProduct.color}</Text>

  <Text style={ {
    fontSize: 18,
    
    marginBottom: 10,
  }}>size: {newProduct.Size}</Text>

  <Text style={ {
    fontSize: 18,
    
    marginBottom: 10,
  }}>Image :</Text>
 <View style={{flexDirection: 'column',justifyContent:"center",alignItems:"center"}}>

 <Image
 source={{ uri: newProduct.image }}
 style={{ width: 200, height: 200 }}
/>
 </View>
 <Text style={ {
  fontSize: 18,
 
  marginBottom: 10,
}}>
carouselImages :  
</Text>
  <View style={{flexDirection: 'column',justifyContent:"center",alignItems:"center"}}>
  
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
  </View>
  
</View>
 </ScrollView>
  <View style={{ flexDirection: "row", gap: 5,justifyContent:"space-around",marginBottom: 30, }}>
  <View style={{
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#33bbff",
    borderRadius: 10,
  }}>
  <Button title="Add Product" color="#33bbff" onPress={addProduct} />

  </View>
  <View style={{
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#dc3545",
    borderRadius: 10,
  }}>
  <Button title="Cancel" color="#dc3545" onPress={togglePreviewModal} />

  </View>
    </View>
  </Modal>


    <View style={styles.buttonContainer}>
      <View style={{ width: "100%" ,padding:10}}>
        <Button title="View all Products" onPress={toggleProductModal} />
      </View>
    </View>

    {/* Product Modal */}
    <Modal
      animationType="slide"
      transparent={false}
      visible={showProductModal}
      onRequestClose={toggleProductModal}
    >
    
      <ScrollView>
      <View style={{}}>
      
        <Text style={ {
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 10,
          marginLeft: 10,
            
        }}>Products:</Text>
        {/* List of products with a pressable item to select a product */}
        <FlatList
          style={{ width: "100%", display: "flex", flexDirection: "column", }}
          data={products}
          renderItem={({ item }) => (
            <Pressable
              style={styles.productItem}
              onPress={() => setSelectedProduct(item)}
            >
            <View>
                <Text style={{fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 2,}}>Title : {item.title}</Text>
                <Text style={{fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 2,}}>Name : {item.name}</Text>
              </View>
              <View>
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 250, height: 300, resizeMode: "contain" }}
                />
              </View>
              
            </Pressable>
          )}
          keyExtractor={(item) => item._id}
        />
        
      </View>
      </ScrollView>
    </Modal>

    {/* Detailed Product View Modal */}
    <Modal
      animationType="slide"
      transparent={false}
      visible={!!selectedProduct}
      onRequestClose={() => setSelectedProduct(null)}
    >
      {/* Display detailed product information here */}
      <Text style={ {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        padding:20,
        
      }}>Product Details:</Text>
     <ScrollView>
     <View style={{
      marginTop:0,
      padding: 10,
      borderRadius: 5,
      gap: 5,
      justifyContent:"center",
      backgroundColor: "#f0f0f0"
      
    }}>
    
    <View  style={{justifyContent:"center",alignItems:"center"}}>
    <Image 
    source={{ uri: selectedProduct?.image }}
    style={{ width: 250, height: 300 }}
  />
    </View>
      <View>
      <Text style={{fontSize: 18,
        
        marginBottom: 2,padding:10}}>Title : {selectedProduct?.title}</Text>
      </View>
      <View>
      <Text  style={{fontSize: 18,
        
        marginBottom: 2,padding:10}}>Name : {selectedProduct?.name}</Text>
      </View>
      <View>
      <Text  style={{fontSize: 18,
        
        marginBottom: 2,padding:10}}>Description : {selectedProduct?.description}</Text>
      </View>
      <View>
      <Text  style={{fontSize: 18,
        
        marginBottom: 2,padding:10}}>Price : ₹{selectedProduct?.price}</Text>
      </View>
      <View>
      <Text  style={{fontSize: 18,
        
        marginBottom: 2,padding:10}}>Color :{selectedProduct?.color}</Text>
      </View>
    
      <View>
      <Text  style={{fontSize: 18,
        
        marginBottom: 2,padding:10}}>Size : {selectedProduct?.Size}</Text>
      </View>
      
    </View>
     </ScrollView>
      <View style={{display:"flex",flexDirection: 'row',justifyContent:"space-around",width:"100%",marginBottom: 20,}}>
        <View>
        <TouchableOpacity  onPress={handleUpdateButtonClick} 
    style={{
     backgroundColor: '#33bbff',
     padding: 8,
     borderRadius: 10,
     width:100,
     alignItems: 'center',}}
    >

    <Text style={{fontSize: 14,color:"#fff"}}>Update</Text>
    </TouchableOpacity>
        </View>
        <View >
        <TouchableOpacity onPress={confirmDdelete}
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
       
        </View>
    </Modal>

    {/* Update Form Modal */}
    {/* Show update form when showUpdateForm is true */}
    <Modal 
      animationType="slide"
      transparent={false}
      visible={ showUpdateForm}
      onRequestClose={() => setShowUpdateForm(false)}
    >
      <View >
      <Text style={ {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        paddingLeft:20
      }}>Update the Product:</Text>
      <View style={{
        marginTop:10,
        padding: 10,
       
        borderRadius: 5,
        gap: 5,
        justifyContent:"center",
        backgroundColor: "#f0f0f0"
      }}
        >
      <TextInput
      style={styles.input}
      placeholder="Title"
      value={updatedProduct.title}
      onChangeText={(text) => setUpdatedProduct({ ...updatedProduct, title: text })}
    />
    <TextInput
      style={styles.input}
      placeholder="Name"
      value={updatedProduct.name}
      onChangeText={(text) => setUpdatedProduct({ ...updatedProduct, name: text })}
    />
    <TextInput
      style={styles.input}
      placeholder="Description"
      value={updatedProduct.description}
      onChangeText={(text) =>
        setUpdatedProduct({ ...updatedProduct, description: text })
      }
    />
    <TextInput
    style={styles.input}
    placeholder="color"
    value={updatedProduct.color}
    onChangeText={(text) =>
      setUpdatedProduct({ ...updatedProduct, color: text })
    }
  />
  <TextInput
  style={styles.input}
  placeholder="size"
  value={updatedProduct.Size}
  onChangeText={(text) =>
    setUpdatedProduct({ ...updatedProduct, Size: text })
  }
/>
    <TextInput
      style={styles.input}
      placeholder="Price"
      value={updatedProduct.price.toString()}
      onChangeText={(text) => setUpdatedProduct({ ...updatedProduct, price: text })}
      keyboardType="numeric"
    />
    <TextInput
      style={styles.input}
      placeholder="Image Url"
      value={updatedProduct.image.toString()}
      onChangeText={(text) =>
        setUpdatedProduct({ ...updatedProduct, image: text })
      }
    />
    <TextInput
      style={styles.input}
      placeholder="carouselImages"
      value={updatedProduct.carouselImages.join(", ")}
      onChangeText={(text) =>
        setUpdatedProduct({ ...updatedProduct, carouselImages: text.split(", ") })
      }
    />
    
    
    <Button title="Preview Product" color="#33bbff" onPress={togglePreviewModal} />
    </View>
    <Modal
      animationType="slide"
      transparent={false}
      visible={showPreview}
      onRequestClose={togglePreviewModal}
    >
    <Text style={ {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
      marginLeft: 20,
    }}>Product Preview:</Text>
    <ScrollView>
      <View  style={{
        marginBottom:35,
        padding: 10,
        
        borderRadius: 5,
        gap: 5,
       
        backgroundColor: "#f0f0f0"
      }}>
       
        <Text style={ {
          fontSize: 18,
          
          marginBottom: 10,
        }}>Title: {updatedProduct.title}</Text>
        <Text style={ {
          fontSize: 18,
        
          marginBottom: 10,
        }}>Name: {updatedProduct.name}</Text>
        <Text style={ {
          fontSize: 18,
          
          marginBottom: 10,
        }}>Description: {updatedProduct.description}</Text>
        <Text style={ {
          fontSize: 18,
          
          marginBottom: 10,
        }}>Price: ₹{updatedProduct.price}</Text>
        <Text style={ {
          fontSize: 18,
          
          marginBottom: 10,
        }}>Color: {updatedProduct.color}</Text>
        <Text style={ {
          fontSize: 18,
          
          marginBottom: 10,
        }}>Size :{updatedProduct.Size}</Text>
        <Text style={ {
          fontSize: 18,
          
          marginBottom: 10,
        }}>Image :</Text>
       <View style={{flexDirection: 'column',justifyContent:"center",alignItems:"center"}}>
      
       <Image
       source={{ uri: updatedProduct.image }}
       style={{ width: 200, height: 200 }}
     />
       </View>
       <Text style={ {
        fontSize: 18,
       
        marginBottom: 10,
      }}>
      carouselImages :  
      </Text>
        <View style={{flexDirection: 'column',justifyContent:"center",alignItems:"center"}}>
        
        <FlatList
          data={updatedProduct.carouselImages}
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
        </View>
        
      </View>
      </ScrollView>
      <View style={{ flexDirection: "row", gap: 5,justifyContent:"space-around",marginBottom: 20, }}>
      <View >
      <TouchableOpacity  onPress={handleUpdateProduct}
    style={{
     backgroundColor: '#33bbff',
     padding: 8,
     borderRadius: 10,
     width:100,
     alignItems: 'center',}}
    >

    <Text style={{fontSize: 14,color:"#fff"}}>Update</Text>
    </TouchableOpacity>

      </View>
      <View >
      <TouchableOpacity onPress={togglePreviewModal}
       style={{
        backgroundColor: '#dc3546d2',
        padding: 8,
        borderRadius: 10,
        width:100,
        alignItems: 'center',}}
       >
       <Text style={{fontSize: 14,color:"#fff"}}>Cancel</Text>
       </TouchableOpacity>

      </View>
        </View>
    </Modal>

      </View>

      <View style={{marginTop:100,gap:5,flexDirection: 'row',justifyContent:"space-around",}}>
      <View>

      <TouchableOpacity  onPress={confirmUpdate}
    style={{
     backgroundColor: '#33bbff',
     padding: 8,
     borderRadius: 10,
     width:120,
     alignItems: 'center',}}
    >

    <Text style={{fontSize: 14,color:"#fff"}}>Confirm Update</Text>
    </TouchableOpacity>

      </View>
       <View  >
       <TouchableOpacity onPress={() => setShowUpdateForm(false)}
       style={{
        backgroundColor: '#dc3546d2',
        padding: 8,
        borderRadius: 10,
        width:100,
        alignItems: 'center',}}
       >
       <Text style={{fontSize: 14,color:"#fff"}}>cancel</Text>
       </TouchableOpacity>

       </View>
       </View>

    </Modal>
  </View>
  );  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    width: "100%",
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
    justifyContent: "center",
    marginTop: 20,
    width: "100%",
  },

  productItem:{
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    justifyContent:"center",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#f0f0f0"
  }
});

export default ProductManager;
