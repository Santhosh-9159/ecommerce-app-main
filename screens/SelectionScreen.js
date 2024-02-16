// SelectionScreen.js
import React from 'react';
import { View, Button, ScrollView } from 'react-native';

const SelectionScreen = ({ navigation }) => {
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      <View style={{ marginTop: 20, width: 200 }}>
        <Button
          title="User Login"
          onPress={() => navigation.navigate('Login', { userType: 'user' })}
        />
      </View>
      <View style={{ marginTop: 20, width: 200 }}>
        <Button
          title="Admin Login"
          onPress={() => navigation.navigate('AdminLogin', { userType: 'admin' })}
        />
      </View>
    </ScrollView>
  );
};

export default SelectionScreen;
