import React, { useState, useEffect } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Box, Text, Pressable, StatusBar } from 'native-base';
import { getRiwayatAbsensi } from '../src/actions/absensi_actions';

const Riwayat = () => {
  const [riwayatAbsensi, setRiwayatAbsensi] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1); // State untuk melacak indeks item yang dipilih
  const [isRefreshing, setIsRefreshing] = useState(false); // State untuk mengontrol status refresh

  useEffect(() => {
    fetchData(); // Memanggil fungsi fetchData saat komponen pertama kali dimuat
  }, []);

  const fetchData = async () => {
    setIsRefreshing(true); // Mengatur isRefreshing menjadi true saat refresh dimulai
    try {
      const data = await getRiwayatAbsensi(); // Mendapatkan data riwayat absensi dari Firebase
      setRiwayatAbsensi(data); // Mengupdate state riwayatAbsensi dengan data yang didapatkan
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsRefreshing(false); // Mengatur isRefreshing menjadi false setelah selesai refresh
    }
  };

  const renderItem = ({ item, index }) => {
    const isSelected = index === selectedIndex; // Menentukan apakah item saat ini dipilih
    let waktuMasuk = item.waktuMasuk ? item.waktuMasuk.split(' ')[1] : '-';
    let waktuPulang = item.waktuPulang ? item.waktuPulang.split(' ')[1] : '-';

    const toggleDetails = () => {
      setSelectedIndex(isSelected ? -1 : index); // Mengatur selectedIndex sesuai dengan kondisi
    };

    return (
      <Pressable onPress={toggleDetails}>
        <Box
          bg={isSelected ? "#181059" : "white"} // Menggunakan kondisi untuk menentukan warna background
          mb={2}
          borderRadius={8}
        >
          <Box backgroundColor={'white'} p={4} flexDirection={'row'} justifyContent={'space-between'}>
            <Text fontWeight={'regular'} numberOfLines={1} ellipsizeMode="tail" style={{ maxWidth: '50%' }}>{item.nama}</Text>
            <Text fontWeight={'regular'}>{waktuMasuk}</Text>
            <Text fontWeight={'regular'}>-</Text>
            <Text fontWeight={'regular'}>{waktuPulang}</Text>
            <Text fontWeight={'regular'} color={item.status === "Masuk" ? "green.500" : item.status === "Izin" ? "yellow.500" : "red.500"}>{item.status}</Text>
          </Box>
          {isSelected && // Menampilkan box abu-abu hanya jika item dipilih
            <Box p={4} >
              <Box justifyContent={'space-between'} flexDirection={'row'}>
                <Text fontWeight={'medium'} color={'white'}>Nama:</Text>
                <Text fontWeight={'medium'} color={'white'}>{item.nama || "-"}</Text>
              </Box>
              <Box justifyContent={'space-between'} flexDirection={'row'}>
                <Text fontWeight={'medium'} color={'white'}>Jenis:</Text>
                <Text fontWeight={'medium'} color={'white'}>{item.jenis || "-"}</Text>
              </Box>
              <Box justifyContent={'space-between'} flexDirection={'row'}>
                <Text fontWeight={'medium'} color={'white'}>Hari:</Text>
                <Text fontWeight={'medium'} color={'white'}>{item.hari || "-"}</Text>
              </Box>
              <Box justifyContent={'space-between'} flexDirection={'row'}>
                <Text fontWeight={'medium'} color={'white'}>Waktu Masuk:</Text>
                <Text fontWeight={'medium'} color={'white'}>{item.waktuMasuk || "-"}</Text>
              </Box>
              <Box justifyContent={'space-between'} flexDirection={'row'}>
                <Text fontWeight={'medium'} color={'white'}>Waktu Pulang:</Text>
                <Text fontWeight={'medium'} color={'white'}>{item.waktuPulang || "-"}</Text>
              </Box>
              {item.jenis === 'Izin' &&
                <Box justifyContent={'space-between'} flexDirection={'row'}>
                  <Text fontWeight={'medium'} color={'white'}>Alasan:</Text>
                  <Text fontWeight={'medium'} color={'white'}>{item.alasan || "-"}</Text>
                </Box>
              }
              <Box justifyContent={'space-between'} flexDirection={'row'}>
                <Text fontWeight={'medium'} color={'white'}>Status: </Text>
                <Text fontWeight={'medium'} color={item.status === "Masuk" ? "green.500" : item.status === "Izin" ? "yellow.500" : "red.500"}>{item.status}</Text>
              </Box>
            </Box>
          }
        </Box>
      </Pressable>
    );
  };

  return (
    <Box flex={1} p={4}>
      <StatusBar backgroundColor={'white'} barStyle="dark-content" />
      <Text fontSize="xl" fontWeight="bold" mb={6}>Riwayat Absensi</Text>
      <FlatList
        data={riwayatAbsensi}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={ // Menambahkan RefreshControl untuk memberikan kontrol refresh pada FlatList
          <RefreshControl
            refreshing={isRefreshing} // Menentukan apakah sedang dalam proses refresh
            onRefresh={fetchData} // Fungsi yang dipanggil saat pengguna menarik layar ke bawah
            colors={['#181059']} // Warna indikator refresh (opsional)
            progressBackgroundColor="#ffffff" // Warna background indikator refresh (opsional)
          />
        }
      />
    </Box>
  );
};

export default Riwayat;
