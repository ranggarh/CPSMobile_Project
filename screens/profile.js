import { Box, Heading, ScrollView, Text, Image, VStack, Pressable, Avatar,Modal, HStack, Button} from "native-base";
import { ImageBackground, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { logoutUser } from "../src/actions/auth_actions";
import { useState,useEffect } from "react";
import { getData } from "../src/utils/localStorage";

const Profile = () =>{
    const navigation = useNavigation();
    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
    const [profile, setProfile] = useState(null);
    const [status, setStatus] = useState(null);

    const fetchData = async () => {
        getData('user')
          .then(res => {
            console.log('User Data:', res);
            setProfile(res);
            setStatus(res.status);
          })
          .catch(error => {
            console.error('Error fetching user data:', error);
          });
      };
      
      useEffect(() => {
        fetchData();
      }, []);

    const handleLogout = () => {
        setIsLogoutModalVisible(true);
    };

      const confirmLogout = () => {
        // Call your logout function here
        // For example: logoutUser();
        // Then navigate to the login screen
        logoutUser();
        {console.log('Log Out Berhasil')}
        navigation.navigate("Login");
      };

      const closeLogoutModal = () => {
        setIsLogoutModalVisible(false);
      };

    return(
        <ScrollView backgroundColor={'white'}>
        <StatusBar backgroundColor={'white'} barStyle="dark-content"/>
        <Box padding={5}>
                <Heading fontSize={18} >Profile Saya</Heading>
            </Box>
        <Box m={4} mt={1} flexDirection={"row"} backgroundColor={'#181059'} borderRadius={10} >
            <Box flex={1} height={150}  borderRadius={10} >
                <Avatar mt={'3.5'} alignSelf={'center'} size="120" bg="blue.500" source={require("../assets/profile.png")}/>
            </Box>
            <Box flex={1} flexDirection={'column'} alignSelf={'center'}>
                <Text color={'white'} fontSize={12}>Centralindo Staff</Text>
                <Text color={'white'} fontWeight={'bold'} mb={2} numberOfLines={1} ellipsizeMode="tail" style={{ maxWidth: '75%' }}>{profile && profile.nama ? profile.nama : "No Name"}</Text>
                <Box  p={2} backgroundColor={'white'} width={'75'} borderRadius={5}>
                    <Text alignSelf={'center'} fontWeight={'bold'}>{status ? status : "-" }</Text>
                </Box>
            </Box>
        </Box>
        <Heading m={4} mt={1} fontSize={16}>Menu Profil</Heading>
        <ScrollView backgroundColor={'white'}>
            <VStack space={2} >
                <Pressable onPress={() =>{navigation.navigate('Edit Profil')} }>
                  <Box flexDirection={'row'} backgroundColor={'#181059'} mx={4} p={4} borderRadius={5}>
                      <Image source={require('../assets/icon/icon_profil.png')} alt="icon-profil"></Image>
                      <Text ml={4} mt={1} textAlign={'center'} fontSize={16} fontWeight="bold" color="white">Edit Profil</Text>
                  </Box>
                </Pressable>
                <Pressable>
                  <Box flexDirection={'row'} backgroundColor={'#181059'} mx={4} p={4} borderRadius={5}>
                      <Image source={require('../assets/icon/icon_izin.png')} alt="icon-izin"></Image>
                      <Text ml={4} mt={1} textAlign={'center'} fontSize={16} fontWeight="bold" color="white">Izin Kerja</Text>
                  </Box>
                </Pressable>

                <Pressable>
                  <Box flexDirection={'row'} backgroundColor={'#181059'} mx={4} p={4} borderRadius={5}>
                      <Image source={require('../assets/icon/icon_daftar_kantor.png')} alt="icon-daftar"></Image>
                      <Text ml={4} mt={1} textAlign={'center'} fontSize={16} fontWeight="bold" color="white">Daftar Kantor</Text>
                  </Box>
                </Pressable>

                <Pressable>
                  <Box flexDirection={'row'} backgroundColor={'#181059'} mx={4} p={4} borderRadius={5}>
                      <Image source={require('../assets/icon/icon_faq.png')} alt="icon-faq"></Image>
                      <Text ml={4} mt={1} textAlign={'center'} fontSize={16} fontWeight="bold" color="white">FAQ</Text>
                  </Box>
                </Pressable>

                <Pressable onPress={handleLogout}>
                
                    <Box flexDirection={'row'} backgroundColor={'#181059'} mx={4} p={4} borderRadius={5}>
                    <Image source={require('../assets/icon/icon_keluar.png')} alt="icon-keluar"></Image>
                    <Text ml={4} mt={1} textAlign={'center'} fontSize={16} fontWeight="bold" color="white">Keluar</Text>
                </Box>
                    
                
                </Pressable>
                
                
            </VStack>
            <Modal isOpen={isLogoutModalVisible} onClose={closeLogoutModal}>
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Logout Confirmation</Modal.Header>
            <Modal.Body>
              <Text>Are you sure you want to logout?</Text>
            </Modal.Body>
            <Modal.Footer>
              <HStack space={2} alignItems="center">
                <Button onPress={closeLogoutModal}>Cancel</Button>
                <Button colorScheme="danger" onPress={confirmLogout}>
                  Logout
                </Button>
              </HStack>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
        </ScrollView>
        </ScrollView>
    );
};

export default Profile;