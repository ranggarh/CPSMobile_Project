import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider} from "native-base";
import Ionicons from "@expo/vector-icons/Ionicons";
import Home from "./screens/home";
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
                color="lightblue" ;
              break;
            case "Favorit":
              iconName = "heart";
              color="lightblue" ;
              break;
            case "Berita":
              iconName = "newspaper-outline";
              color="lightblue" ;
              break;
            case "Profile":
              iconName = "person-circle";
              color="lightblue" ;
              break;
            case "AddWisata":
              iconName = "cloud-upload-outline";
              color="lightblue" ;
              break;
            case "AddBarang":
              iconName = "cloud-upload-outline";
              color="lightblue" ;
              break;
              case "AddBerita":
                iconName = "cloud-upload-outline";
                color="lightblue" ;
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
          backgroundColor:"#0383A2",
          height: 70,
          borderTopWidth: 0,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} options={noHead} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator>    
        
          <Stack.Screen name="Tabs" component={Tabs} options={noHead}/>
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;  
