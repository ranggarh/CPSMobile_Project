import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { Box, Text, Pressable, StatusBar } from 'native-base';
import { getAbsensiData } from '../src/actions/absensi_actions';

const Riwayat = () => {
    const [riwayatAbsensi, setRiwayatAbsensi] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1); // State untuk melacak indeks item yang dipilih

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getAbsensiData();
                setRiwayatAbsensi(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    const renderItem = ({ item, index }) => {
        const isSelected = index === selectedIndex; // Menentukan apakah item saat ini dipilih
        const waktuMasuk = item.waktuMasuk.split(' ')[1];
        const waktuPulang = item.waktuPulang.split(' ')[1];

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
                    <Box  backgroundColor={'white'} p={4} flexDirection={'row'} justifyContent={'space-between'}>
                        <Text fontWeight={'regular'} numberOfLines={1} ellipsizeMode="tail" style={{ maxWidth: '50%' }}>{item.nama}</Text>
                        <Text fontWeight={'regular'}>{waktuMasuk || "-"}</Text>
                        <Text fontWeight={'regular'}>-</Text>
                        <Text fontWeight={'regular'}>{waktuPulang || "-"}</Text>
                        <Text fontWeight={'regular'} color={item.status === "Masuk" ? "green.500" : "red.500"}>{item.status}</Text>
                    </Box>
                    {isSelected && // Menampilkan box abu-abu hanya jika item dipilih
                        <Box p={4} >
                            <Box justifyContent={'space-between'} flexDirection={'row'}>
                                <Text fontWeight={'medium'} color={'white'}>Nama:</Text>
                                <Text fontWeight={'medium'} color={'white'}>{item.nama || "-"}</Text>
                            </Box>
                            <Box justifyContent={'space-between'} flexDirection={'row'}>
                                <Text fontWeight={'medium'} color={'white'}>Hari:</Text>
                                <Text fontWeight={'medium'} color={'white'}>{item.hari || "-"}</Text>
                            </Box>
                            <Box justifyContent={'space-between'} flexDirection={'row'}>
                                <Text fontWeight={'medium'} color={'white'}>Waktu Masuk:</Text>
                                <Text fontWeight={'medium'} color={'white'}>{item.waktuMasuk}</Text>
                            </Box>
                            <Box justifyContent={'space-between'} flexDirection={'row'}>
                                <Text fontWeight={'medium'} color={'white'}>Waktu Pulang:</Text>
                                <Text fontWeight={'medium'} color={'white'}>{item.waktuPulang}</Text>
                            </Box>
                            <Box justifyContent={'space-between'} flexDirection={'row'}>
                                <Text fontWeight={'medium'} color={'white'}>Status: </Text>
                                <Text fontWeight={'medium'} color={item.status === "Masuk" ? "green.500" : "red.500"}>{item.status}</Text>
                            </Box>
    
                            
                        </Box>
                    }
                </Box>
            </Pressable>
        );
    };

    return (
        <Box flex={1} p={4}>
        <StatusBar backgroundColor={'white'} barStyle="dark-content"/>
            <Text fontSize="xl" fontWeight="bold" mb={6}>Riwayat Absensi</Text>
            <FlatList
                data={riwayatAbsensi}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
            />
        </Box>
    );
};

export default Riwayat;
