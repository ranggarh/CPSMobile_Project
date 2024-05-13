import React, { useEffect, useState } from 'react';
import { ScrollView, Alert, Modal, Pressable } from 'react-native';
import { Box, Text } from 'native-base';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { getDistance } from 'geolib';
import FIREBASE from '../src/config/FIREBASE'; // Import instance Firebase yang telah diinisialisasi
import { tambahAbsensi, updateAbsensiPulang } from '../src/actions/absensi_actions';

const MapComponent = ({ latitude, longitude, address, userLocation, selectedLocation }) => {
    // State untuk menyimpan wilayah peta yang ditampilkan
    const [mapRegion, setMapRegion] = useState(null);
    // State untuk menyimpan koordinat lokasi tujuan yang dipilih
    const [destination, setDestination] = useState(null);
    // State untuk menyimpan koordinat garis polyline dari lokasi tujuan ke lokasi awal
    const [polylineCoords, setPolylineCoords] = useState([]);

    useEffect(() => {
      // Mengatur wilayah peta yang ditampilkan berdasarkan posisi pengguna dan tujuan yang dipilih
      if (userLocation) {
        setMapRegion({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      }
      if (selectedLocation === 'Kantor Utama') {
        setDestination({ latitude: -7.322275666311146, longitude: 112.65087023369988 });
      } else if (selectedLocation === 'Kantor Cabang') {
        setDestination({ latitude: -7.314289595990596, longitude: 112.7057918038738 });
      } else {
        setDestination(null);
      }
    }, [userLocation, selectedLocation]);

    useEffect(() => {
      // Mengatur polyline dari lokasi tujuan ke lokasi awal
      if (userLocation && destination) {
        const coords = [
          { latitude: userLocation.latitude, longitude: userLocation.longitude },
          { latitude: destination.latitude, longitude: destination.longitude },
        ];
        setPolylineCoords(coords);
      }
    }, [userLocation, destination]);

    return (
      // Tampilan peta dengan lokasi awal, lokasi tujuan, dan garis polyline
      <MapView
        style={{ flex: 1, height: 350 }}
        region={mapRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {userLocation && <Marker coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }} pinColor="blue" />}
        {destination && <Marker coordinate={destination} pinColor="red" />}
        {polylineCoords.length > 0 && <Polyline coordinates={polylineCoords} strokeColor="#FF0000" strokeWidth={2} />}
      </MapView>
    );
};

const Absen = () => {
  // State untuk menyimpan koordinat posisi pengguna
  const [userLocation, setUserLocation] = useState(null);
  // State untuk menyimpan lokasi yang dipilih
  const [selectedLocation, setSelectedLocation] = useState('Kantor Utama');
  // State untuk menyimpan waktu saat ini
  const [currentTime, setCurrentTime] = useState(new Date());
  // State untuk menampilkan atau menyembunyikan modal konfirmasi absen
  const [showModal, setShowModal] = useState(false);
  

  useEffect(() => {
    // Mengambil posisi pengguna dan mengatur interval waktu saat ini
    const fetchLocation = async () => {
      const { status } = await requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Izin lokasi tidak diberikan.');
        return;
      }

      const location = await getCurrentPositionAsync({});
      setUserLocation(location.coords);
    };

    fetchLocation();

    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleLocationSelection = (location) => {
    // Mengatur lokasi yang dipilih
    setSelectedLocation(location);
  };

  const handleAbsenMasuk = () => {
    // Menampilkan modal konfirmasi absen masuk
    setShowModal(true);
  };

  const handleAbsenPulang = async () => {
    try {
      // Memperbarui absensi pulang
      await updateAbsensiPulang(selectedLocation, currentTime);
      Alert.alert('Berhasil Absen Pulang', 'Anda berhasil absen pulang.');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Gagal Absen Pulang', 'Terjadi kesalahan saat melakukan absen pulang. Silakan coba lagi.');
    }
  };

  const handleConfirmation = async (confirm) => {
    setShowModal(false);
    if (confirm) {
      try {
        const locationToCheck = selectedLocation === 'Kantor Utama'
          ? { latitude: -7.283556, longitude: 112.739756 }
          : selectedLocation === 'Kantor Cabang'
          ? { latitude: -7.314289595990596, longitude: 112.7057918038738 }
          : { latitude: -7.283556, longitude: 112.739756 };
        const distance = getDistance(userLocation, locationToCheck);

        if (distance <= 500) {
          // Jika jarak kurang dari atau sama dengan 500 meter, tambahkan absensi masuk
          await tambahAbsensi(selectedLocation, currentTime);
          Alert.alert('Berhasil Absen Masuk', 'Anda berhasil absen masuk.');
        } else {
          Alert.alert('Gagal Absen Masuk', 'Pastikan Anda Sudah Berada di Lokasi Absen.');
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Gagal Absen Masuk', 'Terjadi kesalahan saat melakukan absen masuk. Silakan coba lagi.');
      }
    }
  };

  const formattedDate = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <>
      <ScrollView backgroundColor={'white'}>
        <MapComponent
          latitude={selectedLocation === 'Kantor Utama' ? -7.283556 : -7.283556}
          longitude={selectedLocation === 'Kantor Utama' ? 112.739756 : selectedLocation === 'Kantor Cabang' ? 112.739756 : 112.739756}
          address="Jl. Raya Bangkingan No.89, Bangkingan, Kec. Lakarsantri, Surabaya, Jawa Timur 61177"
          userLocation={userLocation}
          selectedLocation={selectedLocation}
        />

        <Box p={3} mt={4}>
          {/* Tombol untuk memilih lokasi absen */}
          <Pressable onPress={() => handleLocationSelection('Kantor Utama')}>
            <Box style={{marginRight: 10, borderRadius: 10, overflow: 'hidden',shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 3 }} mb={4} backgroundColor={selectedLocation === 'Kantor Utama' ? '#181059' : '#EEEEEE'} borderRadius={10} p={3}>
              <Text color={selectedLocation === 'Kantor Utama' ? 'white' : '#000'} fontWeight={'bold'}>
                Kantor Utama
              </Text>
              <Text color={selectedLocation === 'Kantor Utama' ? 'white' : '#000'} fontSize={11}>
                Jl. Dukuh Gemol 1B No. 19
              </Text>
            </Box>
          </Pressable>

          {/* Tombol untuk memilih lokasi absen */}
          <Pressable onPress={() => handleLocationSelection('Kantor Cabang')}>
            <Box style={{marginRight: 10, borderRadius: 10, overflow: 'hidden',shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 3 }} backgroundColor={selectedLocation === 'Kantor Cabang' ? '#181059' : '#EEEEEE'} borderRadius={10} p={3}>
              <Text color={selectedLocation === 'Kantor Cabang' ? 'white' : '#000'} fontWeight={'bold'}>
                Primavera Swimming Pool
              </Text>
              <Text color={selectedLocation === 'Kantor Cabang' ? 'white' : '#000'} fontSize={11}>
                Jl. Dukuh Gemol 1B No. 19
              </Text>
            </Box>
          </Pressable>
        </Box>
      </ScrollView>

      <Box flexDirection={'row'} p={3}>
        {/* Tombol untuk absen masuk */}
        <Box flex={1} mr={2}>
          <Pressable onPress={handleAbsenMasuk}>
            <Box w="100%" h={'50'} backgroundColor={'#181059'} borderRadius={15} alignItems={'center'}>
              <Text p={3} color={'white'} fontWeight={'extrabold'} fontSize={'md'} textAlign={'center'}>
                Masuk
              </Text>
            </Box>
          </Pressable>
        </Box>
        {/* Tombol untuk absen pulang */}
        <Box flex={1}>
          <Pressable onPress={handleAbsenPulang}>
            <Box w="100%" h={'50'} backgroundColor={'#FF0000'} borderRadius={15} alignItems={'center'}>
              <Text p={3} color={'white'} fontWeight={'extrabold'} fontSize={'md'} textAlign={'center'}>
                Pulang
              </Text>
            </Box>
          </Pressable>
        </Box>
      </Box>

      {/* Modal Konfirmasi Absen */}
      <Modal visible={showModal} transparent animationType="fade">
        <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <Box backgroundColor="white" p={4} borderRadius={10} width={300} >
            <Box borderBottomColor="#DFDFE3" borderBottomWidth={1} >
              <Text mb={2} fontWeight="medium" fontSize="14" width={'full'} >
                Pastikan Jarak Anda dengan Lokasi sudah Berjarak 50 Meter 
              </Text>
            </Box>
            <Box mt={3} mb={5}>
              <Text>Apakah anda ingin melakukan absensi?</Text>
            </Box>
            <Box flexDirection="row"  m={2}>
              {/* Tombol Ya untuk konfirmasi absen */}
              <Pressable onPress={() => handleConfirmation(true)}>
                <Box backgroundColor="#34A853" borderRadius={8} pr={6} pl={6} p={3} width="100%" h={'50'} alignItems={'center'}>
                  <Text color="white" fontWeight="bold" textAlign={'center'}>
                    Ya
                  </Text>
                </Box>
              </Pressable>
              {/* Tombol Tidak untuk membatalkan absen */}
              <Pressable onPress={() => handleConfirmation(false)}>
                <Box backgroundColor="#FF0000" borderRadius={8}  p={3} width="100%" h={'50'} ml={3}>
                  <Text color="white" fontWeight="bold" textAlign={'center'} >
                    Tidak
                  </Text>
                </Box>
              </Pressable>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Absen;
