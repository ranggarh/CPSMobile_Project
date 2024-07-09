import React, { useState, useEffect } from 'react';
import { FlatList, RefreshControl, StatusBar } from 'react-native';
import { Box, Heading, Text, Image, VStack, Pressable, Avatar, Modal, HStack, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { logoutUser } from '../src/actions/auth_actions';
import { getData } from '../src/utils/localStorage';

const Profile = () => {
  const navigation = useNavigation();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState(null);
  const [image, setImage] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false); // State untuk mengontrol status refresh

  const fetchData = async () => {
    setIsRefreshing(true); // Menandakan bahwa proses refresh dimulai
    try {
      const res = await getData('user');
      console.log('User Data:', res);
      setProfile(res);
      setStatus(res.status);
      setImage(res.image);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsRefreshing(false); // Menandakan bahwa proses refresh telah selesai
    }
  };

  useEffect(() => {
    fetchData(); // Memuat data profil saat komponen pertama kali dimuat
  }, []);

  const handleLogout = () => {
    setIsLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    // Panggil fungsi logout di sini
    logoutUser();
    console.log('Log Out Berhasil');
    navigation.navigate('Login');
  };

  const closeLogoutModal = () => {
    setIsLogoutModalVisible(false);
  };

  const renderItem = ({ item }) => {
    return (
      <VStack space={2}>
        <Pressable onPress={() => navigation.navigate('Edit Profil')}>
          <Box flexDirection={'row'} backgroundColor={'#181059'} mx={4} p={4} borderRadius={5}>
            <Image source={require('../assets/icon/icon_profil.png')} alt="icon-profil" />
            <Text ml={4} mt={1} textAlign={'center'} fontSize={16} fontWeight="bold" color="white">
              Edit Profil
            </Text>
          </Box>
        </Pressable>

        <Pressable onPress={handleLogout}>
          <Box flexDirection={'row'} backgroundColor={'#181059'} mx={4} p={4} borderRadius={5}>
            <Image source={require('../assets/icon/icon_keluar.png')} alt="icon-keluar" />
            <Text ml={4} mt={1} textAlign={'center'} fontSize={16} fontWeight="bold" color="white">
              Keluar
            </Text>
          </Box>
        </Pressable>
      </VStack>
    );
  };

  return (
    <Box backgroundColor={'white'} flex={1}>
      <StatusBar backgroundColor={'white'} barStyle="dark-content" />
      <Box padding={5}>
        <Heading fontSize={18}>Profile Saya</Heading>
      </Box>
      <Box m={4} mt={1} flexDirection={'row'} backgroundColor={'#181059'} borderRadius={10}>
        <Box flex={1} height={150} borderRadius={10}>
          <Avatar
            my={4}
            alignSelf={'center'}
            size="120"
            bg="blue.500"
            source={image ? { uri: image } : require('../assets/profile.jpg')}
          />
        </Box>
        <Box flex={1} flexDirection={'column'} alignSelf={'center'}>
          <Text color={'white'} fontSize={12}>
            Centralindo Staff
          </Text>
          <Text color={'white'} fontWeight={'bold'} mb={2} numberOfLines={1} ellipsizeMode="tail" style={{ maxWidth: '75%' }}>
            {profile && profile.nama ? profile.nama : 'No Name'}
          </Text>
          <Box p={2} backgroundColor={'white'} width={'75'} borderRadius={5}>
            <Text alignSelf={'center'} fontWeight={'bold'}>
              {status ? status : '-'}
            </Text>
          </Box>
        </Box>
      </Box>
      <FlatList
        data={[{ key: 'menu' }]} // Data sementara untuk menyimpan menu profil
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing} // Menentukan apakah sedang dalam proses refresh
            onRefresh={fetchData} // Fungsi yang dipanggil saat pengguna menarik layar ke bawah
            colors={['#181059']} // Warna indikator refresh (opsional)
            progressBackgroundColor="#ffffff" // Warna background indikator refresh (opsional)
          />
        }
      />
      <Modal isOpen={isLogoutModalVisible} onClose={closeLogoutModal}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Konfirmasi Keluar</Modal.Header>
          <Modal.Body>
            <Text>Apakah Anda Yakin Ingin Keluar?</Text>
          </Modal.Body>
          <Modal.Footer>
            <HStack space={2} alignItems="center">
              <Button backgroundColor={'#181059'} onPress={closeLogoutModal}>
                Kembali
              </Button>
              <Button colorScheme="danger" onPress={confirmLogout}>
                Keluar
              </Button>
            </HStack>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default Profile;
