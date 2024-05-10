import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider, Spinner} from "native-base";
import Ionicons from "@expo/vector-icons/Ionicons";
import Home from "./screens/home";
import Absen from "./screens/absen";
import Riwayat from "./screens/riwayat";
import Profile from "./screens/profile";
import EditProfil from "./screens/editProfile";
import Login from "./screens/login/login";
import Register from "./screens/login/register";

// Navigator Declaration
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const noHead = { headerShown: false };

const Tabs = () => {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          switch (route.name) {
            case "Home":
              iconName = "home";
                color="white" ;
              break;
            case "Riwayat":
              iconName = "newspaper";
              color="white" ;
              break;
            case "Profile":
              iconName = "person-circle";
              color="white" ;
              break;
          }
          return (
            <Ionicons
              name={iconName}
              size={30}
              color={focused ? "white" : color}
            />
          );
        },
        tabBarIconStyle: { marginTop: 5 },
        tabBarStyle: {
          backgroundColor: '#6C6DFB',
          height: 70,
          borderTopWidth: 0,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} options={noHead} />
      <Tab.Screen name="Riwayat" component={Riwayat} options={noHead} />
      <Tab.Screen name="Profile" component={Profile} options={noHead}/>
      
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
      {/* <Spinner visibility="visible" /> */}
        <Stack.Navigator>    
          <Stack.Screen name="Login" component={Login} options={noHead} />
          <Stack.Screen name="Register" component={Register} options={noHead}/>
          <Stack.Screen name="Tabs" component={Tabs} options={noHead}/>
          <Stack.Screen name="Absen" component={Absen} />
          <Stack.Screen name="Edit Profil" component={EditProfil} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;  
