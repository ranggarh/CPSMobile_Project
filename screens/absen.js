import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, ToastAndroid, Modal, Pressable } from 'react-native';
import { Box, Text } from 'native-base';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { getDistance } from 'geolib';
import { tambahAbsensi } from '../src/actions/absensi_actions';
import { updateAbsensiPulang } from '../src/actions/absensi_actions';

// Define locations with name, latitude, and longitude
const locations = [
  { name: 'Kantor Centralindo Pancasakti', latitude: -7.3222706, longitude: 112.6507618, address: 'Jl. Raya Bangkingan No.89, Bangkingan, Kec. Lakarsantri, Surabaya, Jawa Timur 61177' },
  { name: 'Kantor STO Telkom Karang Pilang', latitude: -7.3330869, longitude: 112.6955663 , address: 'Jl. Balas Klumprik No.3, Balas Klumprik, Kec. Karangpilang, Surabaya, Jawa Timur 60222'},
  { name: 'Kantor STO Telkom Bambe', latitude: -7.3654041, longitude: 112.6254287, address: 'Jl. Raya Cangkir No.4, Dusun Wates, Cangkir, Kec. Driyorejo, Kabupaten Gresik, Jawa Timur 61177' },
  { name: 'Kantor STO Telkom Kandangan', latitude: -7.2683754, longitude: 112.6651055, address:'Jl. Wonorejo I No.1A, Manukan Kulon, Kec. Tandes, Surabaya, Jawa Timur 60185' },
  { name: 'Kantor STO Telkom Kebalen', latitude: -7.2314511, longitude: 112.7347862, address: 'Jl. Kalisosok Jl. Dapuan Bend. Gg. I No.12, Krembangan Sel., Kec. Krembangan, Surabaya, Jawa Timur 60175' },
];

// Define and export MemoizedMapComponent
export const MemoizedMapComponent = React.memo(({ latitude, longitude, address, userLocation, selectedLocation }) => {
  const [mapRegion, setMapRegion] = useState(null);

  useEffect(() => {
    if (userLocation) {
      setMapRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
  }, [userLocation]);

  const destination = useMemo(() => {
    const selected = locations.find(loc => loc.name === selectedLocation);
    return selected ? { latitude: selected.latitude, longitude: selected.longitude } : null;
  }, [selectedLocation]);

  const polylineCoords = useMemo(() => {
    if (userLocation && destination) {
      return [
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        { latitude: destination.latitude, longitude: destination.longitude },
      ];
    }
    return [];
  }, [userLocation, destination]);

  return (
    <MapView
      style={{ height: 300, marginBottom: 15}}
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
});

const Absen = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(locations[0].name); // Default to the first location
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
  }, []);

  const handleLocationSelection = (location) => {
    setSelectedLocation(location);
  };

  const handleAbsenMasuk = () => {
    setShowModal(true);
  };

  const handleAbsenPulang = async () => {
    try {
      await updateAbsensiPulang(selectedLocation, currentTime);
      ToastAndroid.show('Berhasil Absen Pulang', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error:', error);
      ToastAndroid.show('Gagal Absen Pulang', ToastAndroid.SHORT);
    }
  };

  const handleConfirmation = async (confirm) => {
    setShowModal(false);
    if (confirm) {
      try {
        const locationToCheck = locations.find(loc => loc.name === selectedLocation);

        if (!locationToCheck) {
          ToastAndroid.show('Lokasi tidak valid', ToastAndroid.SHORT);
          return;
        }

        const distance = getDistance(userLocation, locationToCheck);
  
        if (distance <= 5000) {
          await tambahAbsensi(selectedLocation, currentTime);
          ToastAndroid.show('Berhasil Absen Masuk', ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('Gagal Absen Masuk', ToastAndroid.SHORT);
        }
      } catch (error) {
        console.error('Error:', error);
        ToastAndroid.show('Gagal Absen Masuk', ToastAndroid.SHORT);
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
    <Box backgroundColor={'white'}>
      <MemoizedMapComponent
          latitude={locations.find(loc => loc.name === selectedLocation)?.latitude || locations[0].latitude}
          longitude={locations.find(loc => loc.name === selectedLocation)?.longitude || locations[0].longitude}
          userLocation={userLocation}
          selectedLocation={selectedLocation}
        />
      </Box>
      <ScrollView backgroundColor={'white'} >
        <Box p={4} mt={-4}>
          <Box flexDirection={'row'} justifyContent={'space-between'} mb={4}>
            <Text fontWeight={'bold'}  mx={2} >{formattedDate}</Text>
            <Text fontWeight={'bold'}  mx={2} >{formattedTime}</Text>
          </Box>
          {/* Render buttons dynamically from locations array */}
          {locations.map(loc => (
            <Pressable key={loc.name} onPress={() => handleLocationSelection(loc.name)}>
              <Box style={{ borderRadius: 10, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 3 }} mb={4} backgroundColor={selectedLocation === loc.name ? '#181059' : '#EEEEEE'} borderRadius={10} p={3}>
                <Text color={selectedLocation === loc.name ? 'white' : '#000'} fontWeight={'bold'}>
                  {loc.name}
                </Text>
                <Text color={selectedLocation === loc.name ? 'white' : '#000'} fontSize={11}>
                {loc.address}
                </Text>
              </Box>
            </Pressable>
          ))}
        </Box>
      </ScrollView>

      <Box flexDirection={'row'} p={3}>
        {/* Button for check-in */}
        <Box flex={1} mr={2}>
          <Pressable onPress={handleAbsenMasuk}>
            <Box w="100%" h={'50'} backgroundColor={'#181059'} borderRadius={15} alignItems={'center'}>
              <Text p={3} color={'white'} fontWeight={'extrabold'} fontSize={'md'} textAlign={'center'}>
                Masuk
              </Text>
            </Box>
          </Pressable>
        </Box>
        {/* Button for check-out */}
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

      {/* Confirmation Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <Box backgroundColor="white" p={4} borderRadius={10} width={300} >
            <Box borderBottomColor="#DFDFE3" borderBottomWidth={1} >
              <Text mb={2} fontWeight="medium" fontSize="14" width={'full'}>
                Pastikan Jarak Anda dengan Lokasi sudah Berjarak 50 Meter
              </Text>
            </Box>
            <Box mt={3} mb={5}>
              <Text>Apakah anda ingin melakukan absensi?</Text>
            </Box>
            <Box flexDirection="row" m={2}>
              {/* Yes button for confirmation */}
              <Pressable onPress={() => handleConfirmation(true)}>
                <Box backgroundColor="#34A853" borderRadius={8} pr={6} pl={6} p={3} width="100%" h={'50'} alignItems={'center'}>
                  <Text color={'white'} fontWeight={'bold'} fontSize={'md'} textAlign={'center'}>
                    Ya
                  </Text>
                </Box>
              </Pressable>
              <Box ml={2}>
                {/* No button for confirmation */}
                <Pressable onPress={() => handleConfirmation(false)}>
                  <Box backgroundColor="#EEEEEE" borderColor="#9E9E9E" borderWidth={1} borderRadius={8} pr={6} pl={6} p={3} width="100%" h={'50'} alignItems={'center'}>
                    <Text color={'#000'} fontWeight={'bold'} fontSize={'md'} textAlign={'center'}>
                      Tidak
                    </Text>
                  </Box>
                </Pressable>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Absen;
