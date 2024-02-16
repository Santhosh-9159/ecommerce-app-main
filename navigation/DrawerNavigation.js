import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import DashboardOverview from '../screens/AdminScreen/DashboardOverview';
import UserManagement from '../screens/AdminScreen/UserManagement';
import ProductManagement from '../screens/AdminScreen/ProductManagement';
import OrderManagement from '../screens/AdminScreen/OrderManagement';
import AnalyticalReports from '../screens/AdminScreen/AnalyticalReports ';
import Logout from '../screens/AdminScreen/Logout';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    
      <Drawer.Navigator
        drawerContentOptions={{
          activeTintColor: '#2089DC',
          itemStyle: { marginVertical: 5 },
          labelStyle: {
            marginLeft: -16, // Adjust the margin to align the text with the icon
          },
        }}
      >
       
        <Drawer.Screen 
          name="DashboardOverview" 
          component={DashboardOverview} 
          options={{
            headerTitleAlign:"center",
            title: 'Dashboard Overview',
            drawerIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? 'ios-menu' : 'ios-menu-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen 
          name="UserManagement" 
          component={UserManagement} 
          options={{
            headerTitleAlign:"center",
            title: 'User Management',
            drawerIcon: ({ focused, color, size }) => (
              <FontAwesome5  name="user-cog"  size={24} color={focused ? "#1a75ff": "#808080"} />
            ),
          }}
        />
        <Drawer.Screen 
          name="ProductManagement" 
          component={ProductManagement} 
          options={{
            headerTitleAlign:"center",
            title: 'Product Management',
            drawerIcon: ({ focused, color, size }) => (
              <MaterialCommunityIcons name="store-settings" size={24} color={focused ? "#1a75ff": "#808080"} />    
              ),
          }}
        />
        <Drawer.Screen 
          name="OrderManagement" 
          component={OrderManagement} 
          options={{
            headerTitleAlign:"center",
            title: 'Order Management',
            drawerIcon: ({ focused, color, size }) => (
              <MaterialIcons name="border-color" size={24} color={focused ? "#1a75ff": "#808080"}/>
            ),
          }}
        />
        <Drawer.Screen 
          name="AnalyticsReports" 
          component={AnalyticalReports} 
          options={{
            headerTitleAlign:"center",
            title: 'Analytics Reports',
            drawerIcon: ({ focused, color, size }) => (
              <Octicons name="graph" size={24} color={focused ? "#1a75ff": "#808080"} />
              
            ),
          }}
        />
        <Drawer.Screen 
        name="Logout" 
        component={Logout} 
        options={{
          headerTitleAlign:"center",
          title: 'Logout',
          drawerIcon: ({ focused, color, size }) => (
            <AntDesign name="logout" size={24} color={focused ? "#1a75ff": "#808080"}/>
          ),
        }}
      />
      </Drawer.Navigator>
    
  );
};

export default DrawerNavigation;
