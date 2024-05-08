import React, { useEffect, useState } from 'react';
import { ScrollView, Alert, Modal, Pressable, View } from 'react-native';
import { Box, Text } from 'native-base';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { getDistance } from 'geolib';

//Fungsi untuk mendapatkan titik lokasi user dan tujuan (allow/not)
const MapComponent = ({ latitude, longitude, address, userLocation, selectedLocation }) => {
    const [mapRegion, setMapRegion] = useState(null); // Menyimpan wilayah peta yang tampil
    const [destination, setDestination] = useState(null); // Menyimpan lokasi koordinat tujuan berdasarkan yang dipilih / 'selected destination'
    const [polylineCoords, setPolylineCoords] = useState([]); // menarik garis dari lokasi tujuan ke lokasi awal

    // Untuk memperbarui mark maps ketika posisi pengguna / posisi tujuan kantor berubah
    useEffect(() => {
      if (userLocation) {
        setMapRegion({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      }//, 
      if (selectedLocation === 'Kantor Utama') {
        setDestination({ latitude: -7.322275666311146, longitude: 112.65087023369988 });
      } else if (selectedLocation === 'Kantor Cabang') {
        setDestination({ latitude: -7.314289595990596, longitude: 112.7057918038738 });
      } else {
        setDestination(null);
      }
    }, [userLocation, selectedLocation]);

    // Memperbarui garis yang ditarik dari lokasi tujuan dan titik awal
    useEffect(() => {
      if (userLocation && destination) {
        const coords = [
          { latitude: userLocation.latitude, longitude: userLocation.longitude },
          { latitude: destination.latitude, longitude: destination.longitude },
        ];
        setPolylineCoords(coords);
      }
    }, [userLocation, destination]);

    return (
      //output maps yang menampilkan lokasi awal + tujuan dan garis
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
    const [userLocation, setUserLocation] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState('Kantor Utama');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
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
      setSelectedLocation(location);
    };

    const handleAbsen = () => {
      if (!userLocation) {
        console.log('Tidak dapat mendapatkan posisi Anda.');
        return;
      }

      setShowModal(true);
    };

    const handleConfirmation = (confirm) => {
      setShowModal(false);
      if (confirm) {
        const locationToCheck = selectedLocation === 'Kantor Utama'
          ? { latitude: -7.283556, longitude: 112.739756 }
          : selectedLocation === 'Kantor Cabang'
          ? { latitude: -7.314289595990596, longitude: 112.7057918038738 }
          : { latitude: -7.283556, longitude: 112.739756 };
        const distance = getDistance(userLocation, locationToCheck);

        if (distance <= 500) {
          console.log('Anda berhasil absen.');
          Alert.alert('Berhasil Absen', 'Anda berhasil absen.');
        } else {
          console.log('Anda berada di luar jarak absen.');
          Alert.alert('Gagal Absen', 'Lokasi Anda tidak cocok dengan yang dipilih. Silakan pilih lokasi lain atau coba lagi.');
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
            <Box flexDirection={'row'} justifyContent={'space-between'}>
              <Text ml={2} mt={-3} fontWeight={'bold'} mb={3}>{formattedDate}</Text>
              <Text mr={2} mt={-3} fontWeight={'bold'} mb={3}>{formattedTime}</Text>
            </Box>
            <Pressable onPress={() => handleLocationSelection('Kantor Utama')}>
              <Box style={{marginRight: 10, borderRadius: 10, overflow: 'hidden',shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 3 }} mb={4} backgroundColor={selectedLocation === 'Kantor Utama' ? '#5968FF' : '#EEEEEE'} borderRadius={10} p={3}>
                <Text color={selectedLocation === 'Kantor Utama' ? 'white' : '#000'} fontWeight={'bold'}>
                  Kantor Utama
                </Text>
                <Text color={selectedLocation === 'Kantor Utama' ? 'white' : '#000'} fontSize={11}>
                  Jl. Dukuh Gemol 1B No. 19
                </Text>
              </Box>
            </Pressable>

            <Pressable onPress={() => handleLocationSelection('Kantor Cabang')}>
              <Box style={{marginRight: 10, borderRadius: 10, overflow: 'hidden',shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 3 }} backgroundColor={selectedLocation === 'Kantor Cabang' ? '#5968FF' : '#EEEEEE'} borderRadius={10} p={3}>
                <Text color={selectedLocation === 'Kantor Cabang' ? 'white' : '#000'} fontWeight={'bold'}>
                  Primavera Swimming Pool
                </Text>
                <Text color={selectedLocation === 'Kantor Cabang' ? 'white' : '#000'} fontSize={11}>
                  Jl. Dukuh Gemol 1B No. 19
                </Text>
              </Box>
            </Pressable>

            <Pressable onPress={() => handleLocationSelection('Kantor Cabang 3')}>
              <Box style={{marginRight: 10, borderRadius: 10, overflow: 'hidden',shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 3 }} mt={4} backgroundColor={selectedLocation === 'Kantor Cabang 3' ? '#5968FF' :'#EEEEEE'} borderRadius={10} p={3}>
                <Text color={selectedLocation === 'Kantor Cabang 3' ? 'white' : '#000'} fontWeight={'bold'}>
                  Kantor Cabang 3 
                </Text>
                <Text color={selectedLocation === 'Kantor Cabang 3' ? 'white' : '#000'} fontSize={11}>
                  Jl. Dukuh Gemol 1B No. 19
                </Text>
              </Box>
            </Pressable>
          </Box>
        </ScrollView>

        <Box flexDirection={'row'} p={3}>
          <Box flex={1} mr={2}>
            <Pressable onPress={() => setShowModal(true)}>
              <Box w="100%" h={'50'} backgroundColor={'#0066FF'} borderRadius={15} alignItems={'center'}>
                <Text p={3} color={'white'} fontWeight={'extrabold'} fontSize={'md'} textAlign={'center'}>
                  Masuk
                </Text>
              </Box>
            </Pressable>
          </Box>
          <Box flex={1}>
            <Pressable onPress={() => console.log('Tombol Keluar Ditekan')}>
              <Box w="100%" h={'50'} backgroundColor={'#FF0000'} borderRadius={15} alignItems={'center'}>
                <Text p={3} color={'white'} fontWeight={'extrabold'} fontSize={'md'} textAlign={'center'}>
                  Keluar
                </Text>
              </Box>
            </Pressable>
          </Box>
        </Box>

        {/* Modal Pertanyaan */}
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
                <Pressable onPress={() => handleConfirmation(true)}>
                  <Box backgroundColor="#34A853" borderRadius={8} pr={6} pl={6} p={3} width="100%" h={'50'} alignItems={'center'}>
                    <Text color="white" fontWeight="bold" textAlign={'center'}>
                      Ya
                    </Text>
                  </Box>
                </Pressable>
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
