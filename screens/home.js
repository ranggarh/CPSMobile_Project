import { Box, Heading, ScrollView, Text, Image, Pressable, Avatar} from "native-base";
import { Ionicons } from '@expo/vector-icons';
import { ImageBackground, StatusBar, RefreshControl } from "react-native";
import React, {useState, useEffect} from "react";
import { useNavigation } from "@react-navigation/native";
import { getData } from "../src/utils/localStorage";
import { getAbsensiData } from "../src/actions/absensi_actions";

const Home = () =>{
    const [currentTime, setCurrentTime] = useState(new Date());
    const navigation = useNavigation();
    const [profile, setProfile] = useState(null);
    const [absensiData, setAbsensiData] = useState({});
    const [isRefreshing, setIsRefreshing] = useState(false);

    //Ambil data absensi Kehadiran dari absensi_action (getabsensidata)
    const fetchAbsensiData = async () => {
        try {
            const data = await getAbsensiData();
            setAbsensiData(data);
        } catch (error) {
            console.error('Error fetching absensi data:', error);
        }
    };

    //Ambil data login user
    const fetchData = async () => {
        getData('user')
          .then(res => {
            console.log('User Data:', res);
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

    //Set interval refresh data
    useEffect(() => {
        const intervalId = setInterval(() => {
        setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true); // Set state isRefreshing menjadi true untuk menunjukkan sedang proses refresh

        // Ambil ulang data kehadiran
        await fetchAbsensiData();

        // Setelah selesai refresh, atur state isRefreshing menjadi false
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

    const data = [
        { id: 1, name: "John Doe", time: "08:00", category: "Masuk" },
        { id: 2, name: "Jane Doe", time: "08:15", category: "Telat" },
        { id: 3, name: "Michael Smith", time: "07:45", category: "Masuk" },
        { id: 4, name: "Jessica Brown", time: "08:05", category: "Telat" },
        { id: 5, name: "Jessica Brown Brown bbbbbbbbbbbb", time: "08:05", category: "Telat" },
    ];

    return(
        <ScrollView backgroundColor={'white'} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh}/>}>
            <StatusBar backgroundColor={'white'} barStyle="dark-content"/>
            {/* Section 1 header */}
            <Box flexDirection={'row'} justifyContent={'space-between'}>
                <Box padding={5}>
                    <Heading mt={3} fontSize={18} >Cps Mobile</Heading>
                </Box>
                <Box padding={5}>
                    <Box mt={1} mr={2} alignItems={'center'} borderRadius={'1'} >
                    <Avatar
                        size="sm"
                        bg="blue.500" 
                        source={require("../assets/profile.png")} 
                    />
                    </Box>
                </Box>
            </Box>

            {/* Section 2 Selamat Datang */} 
            <Box m={4} mt={-2} flexDirection={"row"} backgroundColor={'#181059'} borderRadius={10} >
                <Box height={150} backgroundColor={'blue.100'} borderRadius={10}>
                    <Image source={require('../assets/selamat_datang_assets.jpg')}
                    style={{ width: 200,height:150, borderRadius:10 }} alt="Selamat Datang ICON"></Image>
                </Box>
                <Box flexDirection={'column'} alignSelf={'center'}>
                    <Text color={'white'} fontSize={12}>Selamat Datang</Text>
                    <Text color={'white'} fontWeight={'bold'} mb={2} numberOfLines={1} ellipsizeMode="tail" style={{ maxWidth: '75%' }}>{profile && profile.nama ? profile.nama : "No Name"}</Text>
                    <Box  p={2} backgroundColor={'white'} width={'75'} borderRadius={5}>
                        <Text alignSelf={'center'} fontWeight={'bold'}>Staff IT</Text>
                    </Box>
                </Box>
            </Box>

            {/* Section 3 Dashboard */}
            <Heading m={5} mt={1} fontSize={16}>Dashboard</Heading>
            <Box m={4} mt={-2} borderRadius={10}>

                <Box width={'full'} height={130} backgroundColor={'#181059'} style={{marginRight: 10, borderRadius: 10, overflow: 'hidden',shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5  }}>
                        <Text left={5} top={4} fontWeight={'bold'} color={'white'} >Kehadiran</Text>
                            <Box
                                flex={1}
                                py={5}
                                mx={4}
                                flexDirection={'row'}
                                
                            >
                                <Box mt={2} mr={1} p={2} width={75} height={65} backgroundColor={'white'} borderRadius={5}>
                                    <Text fontSize={10} fontWeight={'bold'} mt={-1}>Masuk</Text>
                                    <Text fontWeight={'bold'} textAlign={'center'}  fontSize={25}>{absensiData[profile?.uid] ? absensiData[profile?.uid].masuk : 0}</Text>
                                </Box>
                                <Box mt={2} ml={1} mr={1} p={2} width={75} height={65} backgroundColor={'white'} borderRadius={5}>
                                    <Text fontSize={10} fontWeight={'bold'} mt={-1}>Alpha</Text>
                                    <Text fontWeight={'bold'} textAlign={'center'} fontSize={25}>{absensiData[profile?.uid] ? absensiData[profile?.uid].alpa : 0}</Text>
                                </Box>
                                <Box mt={2} ml={1} mr={1} p={2} width={75} height={65} backgroundColor={'white'} borderRadius={5}>
                                    <Text fontSize={10} fontWeight={'bold'} mt={-1}>Izin Kerja</Text>
                                    <Text fontWeight={'bold'} textAlign={'center'} fontSize={25}>{absensiData[profile?.uid] ? absensiData[profile?.uid].alpa : 0}</Text>
                                </Box>
                                <Box mt={2} ml={1} mr={1} p={2} width={75} height={65}  borderRadius={5}>
                                    <Image source={require('../assets/icon/icon_riwayat.png')} alt="riwayat"></Image>
                                </Box>
                                
                            </Box>
                    
                </Box>
            </Box>

            {/* Section 4 Menu Utama */}
            <Heading m={5} mt={1} fontSize={16}>Menu Utama</Heading>
            <Pressable onPress={() => navigation.navigate('Absen')}>
                <Box m={4} mt={-2} flexDirection={"row"} borderRadius={10}>
                    <Box backgroundColor={'#181059'} width={'49%'} height={75} style={{ borderRadius: 10, overflow: 'hidden',shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5 }}>
                        <Box
                                flex={1}
                                justifyContent="center"
                                alignItems="center"
                                
                            >
                                <Text fontWeight={'extrabold'} color={'white'} fontSize={24}>Presensi</Text>
                        </Box>    
                    </Box>
                    <Box width={'2%'} backgroundColor={'white'} />
                    <Box backgroundColor={'#181059'} width={'49%'} height={75} style={{ borderRadius: 10, overflow: 'hidden',shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5  }} borderColor={'grey'}>
                        <Box
                                flex={1}
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Text fontWeight={'extrabold'} color={'white'} fontSize={24}>Riwayat</Text>
                        </Box>
                        
                    </Box>
                </Box>
            </Pressable>

            {/* Section 5 Top Presensi Tercepat */}
            <Heading m={5} mt={1} fontSize={16}>Top Presensi Tercepat</Heading>
            <Box m={3} mt={-2} borderRadius={10} p={3} backgroundColor={'#EEEEEE'}>
                {data.map((item) => (
                        <Box key={item.id} flexDirection="row" alignItems="center" justifyContent="space-between" padding={3} m={1}>
                            <Text>{item.id + ".  "}</Text>
                            <Box flex={2} paddingRight={10}>
                                <Text numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                            </Box>
                            <Box flex={1}>
                                <Text>{item.time}</Text>
                            </Box>
                            <Box flex={1}>
                                <Text color={item.category === "Masuk" ? "green.500" : "red.500"}>{item.category}</Text>
                            </Box>
                        </Box>
                    ))}
                
            </Box>
        </ScrollView>
    );
};

export default Home;
