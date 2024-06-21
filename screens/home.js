import { Box, Heading, ScrollView, Text, Image, Pressable, Avatar } from "native-base";
import { Ionicons } from '@expo/vector-icons';
import { ImageBackground, StatusBar, RefreshControl, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { getData } from "../src/utils/localStorage";
import { getAbsensiData, getTopTercepat } from "../src/actions/absensi_actions";

const Home = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const navigation = useNavigation();
    const [profile, setProfile] = useState(null);
    const [absensiData, setAbsensiData] = useState({});
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [topTercepat, setTopTercepat] = useState([]);

    const fetchAbsensiData = async () => {
        try {
            const data = await getAbsensiData();
            setAbsensiData(data);
        } catch (error) {
            console.error('Error fetching absensi data:', error);
        }
    };

    const fetchData = async () => {
        getData('user')
          .then(res => {
            // console.log('User Data:', res);
            setProfile(res);
          })
          .catch(error => {
            console.error('Error fetching user data:', error);
          });
    };

    useEffect(() => {
        fetchData();
        fetchAbsensiData();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchAbsensiData();
        await fetchData();
        
        setIsRefreshing(false);
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

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getTopTercepat();
                setTopTercepat(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    const limitedTopTercepat = topTercepat.slice(0, 4).reverse();

    const renderItem = ({ item }) => {
        const waktuMasuk = item.waktuMasuk.split(' ')[1];
        const waktuPulang = item.waktuPulang.split(' ')[1];

        return (
            <Pressable>
                <Box mb={2}  px={5}>
                    <Box borderRadius={8} backgroundColor={'white'} p={4} flexDirection={'row'} justifyContent={'space-between'}>
                        <Text fontWeight={'regular'}  numberOfLines={1} ellipsizeMode="tail" style={{ maxWidth: '45%' }}>{item.nama}</Text>
                        <Text fontWeight={'regular'} ml={3} textAlign={'left'} >{waktuMasuk || "-"}</Text>
                        <Text fontWeight={'regular'} color={item.status === "Masuk" ? "green.500" : "red.500"}>{item.status}</Text>
                    </Box>
                </Box>
            </Pressable>
        );
    };

    const renderHeader = () => (
        <>
            <StatusBar backgroundColor={'#181059'} barStyle="white" />
            <Box flexDirection={'row'} justifyContent={'space-between'}>
                <Box padding={5}>
                    <Heading mt={1} fontSize={18}>Cps Mobile</Heading>
                </Box>
                <Box padding={5}>
                    <Box  mr={2} alignItems={'center'} borderRadius={'1'}>
                        <Avatar size="sm" bg="blue.500" source={require("../assets/profile.png")} />
                    </Box>
                </Box>
            </Box>
            <Box m={4} mt={-2} flexDirection={"row"} backgroundColor={'#181059'} borderRadius={10}>
                <Box height={150} backgroundColor={'blue.100'} borderRadius={10}>
                    <Image source={require('../assets/selamat_datang_assets.jpg')} style={{ width: 200, height: 150, borderRadius: 10 }} alt="Selamat Datang ICON"></Image>
                </Box>
                <Box flexDirection={'column'} alignSelf={'center'}>
                    <Text color={'white'} fontSize={12}>Selamat Datang</Text>
                    <Text color={'white'} fontWeight={'bold'} mb={2} numberOfLines={1} ellipsizeMode="tail" style={{ maxWidth: '75%' }}>{profile && profile.nama ? profile.nama : "No Name"}</Text>
                    <Box p={2} backgroundColor={'white'} width={'75'} borderRadius={5}>
                        <Text alignSelf={'center'} fontWeight={'bold'}>Staff IT</Text>
                    </Box>
                </Box>
            </Box>
            <Box justifyContent={'space-between'} flexDirection={'row'}>
                <Heading m={5} mt={1} fontSize={16}>Dashboard</Heading>
                <Heading m={5} mt={1} fontSize={16}>{formattedTime}</Heading>
            </Box>
            <Box m={4} mt={-2} borderRadius={10}>
                <Box width={'full'} height={130} backgroundColor={'#181059'} style={{ marginRight: 10, borderRadius: 10, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5 }}>
                    <Box justifyContent={'space-between'} flexDirection={'row'}>
                        <Text left={5} top={4} fontWeight={'bold'} color={'white'}>Kehadiran</Text>
                        <Text fontWeight={'bold'} top={4} right={4} color={'white'}>{formattedDate}</Text>
                    </Box>
                    
                    <Box flex={1} py={5} mx={4} flexDirection={'row'}>
                        <Box mt={2} ml={2} mr={1} p={2} width={75} height={65} backgroundColor={'white'} borderRadius={5}>
                            <Text fontSize={10} fontWeight={'bold'} mt={-1}>Masuk</Text>
                            <Text fontWeight={'bold'} flex={1}  textAlign={'center'} fontSize={25}>{absensiData[profile?.uid] ? absensiData[profile?.uid].masuk : 0}</Text>
                        </Box>
                        <Box mt={2} ml={1} mr={1} p={2} width={75} height={65} backgroundColor={'white'} borderRadius={5}>
                            <Text fontSize={10} fontWeight={'bold'} mt={-1}>Alpha</Text>
                            <Text fontWeight={'bold'} flex={1} textAlign={'center'} fontSize={25}>{absensiData[profile?.uid] ? absensiData[profile?.uid].alpa : 0}</Text>
                        </Box>
                        <Box mt={2} ml={1} mr={1} p={2} width={75} height={65} backgroundColor={'white'} borderRadius={5}>
                            <Text fontSize={10} fontWeight={'bold'} mt={-1}>Izin Kerja</Text>
                            <Text fontWeight={'bold'} flex={1}  textAlign={'center'} fontSize={25}>{absensiData[profile?.uid] ? absensiData[profile?.uid].izin : 0}</Text>
                        </Box>
                        <Box  ml={1} mt={1} p={2} width={75} height={65} borderRadius={5}>
                            <Pressable onPress={() => navigation.navigate('Riwayat')}>
                                <Ionicons size={45} color={'white'} name="newspaper"></Ionicons>
                                <Text color={'white'} fontSize={11} ml={1} fontWeight={'bold'}>Riwayat</Text>
                            </Pressable>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Heading m={5} mt={1} fontSize={16}>Menu Utama</Heading>
            <Box m={4} mt={-2} flexDirection={"row"} borderRadius={10}>
                <Box flex={1} mr={1} p={2} backgroundColor={'#181059'} color={'white'} width={'75'} borderRadius={5}>
                        <Pressable onPress={() => navigation.navigate('Absen')}>
                            <Text m={3} alignSelf={'center'}  color={'white'} fontSize={20}  fontWeight={'extrabold'}>Presensi</Text>
                        </Pressable>
                </Box>
                <Box flex={1} ml={1} p={2} backgroundColor={'#181059'} color={'white'} width={'75'} borderRadius={5}>
                        <Pressable onPress={() => navigation.navigate('Izin Kerja')}>
                            <Text m={3} alignSelf={'center'}  color={'white'} fontSize={20} fontWeight={'extrabold'}>Izin Kerja</Text>
                        </Pressable>
                </Box>
            </Box>
            <Heading m={5} mt={1} fontSize={16}>Presensi Terkini</Heading>
        </>
    );

    const renderFooter = () => (
        <Box m={3}mt={-2} borderRadius={10} p={3} backgroundColor={'#EEEEEE'}>
        </Box>
    );

    return (
        <FlatList
            data={limitedTopTercepat}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        />
    );
};

export default Home;
