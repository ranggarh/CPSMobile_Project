import { Box, Avatar, ScrollView, Heading, Input, Button, Text, Pressable, Image, Spinner } from "native-base";
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from "react";
import { getData } from "../src/utils/localStorage";
import { tambahIzinAbsen } from "../src/actions/absensi_actions"; // Impor tambahIzinAbsen dari actions absensi
import { useNavigation } from "@react-navigation/native";

const IzinKerja = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useState(null);
    const [status, setStatus] = useState("");
    const [image, setImage] = useState(null);
    const [alasan, setAlasan] = useState(""); // State untuk menyimpan alasan

    useEffect(() => {
        fetchData(); // Ambil data profil saat komponen dimuat
        requestMediaLibraryPermission(); // Minta izin akses ke galeri foto saat komponen dimuat
    }, []);

    // Fungsi untuk mengambil data profil
    const fetchData = async () => {
        try {
            const userData = await getData('user');
            setProfile(userData);
            setStatus(userData.status);
            
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    // Fungsi untuk meminta izin akses ke galeri foto
    const requestMediaLibraryPermission = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Maaf, kami memerlukan izin untuk mengakses galeri foto!');
            }
        } catch (error) {
            console.error('Error requesting media library permission:', error);
        }
    };

    // Fungsi untuk memilih gambar dari galeri
    // Fungsi untuk memilih gambar dari galeri
// Fungsi untuk memilih gambar dari galeri
// Fungsi untuk memilih gambar dari galeri
const pickImage = async () => {
    try {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log('ImagePicker result:', result); // Periksa hasil yang dikembalikan

        if (result.cancelled) {
            console.log('User cancelled image picker');
            return; // Hentikan eksekusi jika gambar dibatalkan
        }

        if (!result.assets || result.assets.length === 0 || !result.assets[0].uri) {
            console.log('Image URI is undefined or null:', result);
            alert('Gagal memilih gambar. Silakan coba lagi.'); // Tampilkan pesan kesalahan jika URI tidak ada
            return;
        }

        // Jika berhasil, set gambar ke state image
        setImage(result.assets[0].uri);
        console.log('Image URI:', result.assets[0].uri); // Tampilkan URI gambar yang dipilih
    } catch (error) {
        console.error('Error picking image:', error);
        alert('Gagal memilih gambar. Silakan coba lagi.'); // Tangani kesalahan saat memilih gambar
    }
};




    // Fungsi untuk menambahkan izin absen
    const handleTambahIzin = async () => {
        try {
            // Validasi input sebelum menambahkan izin absen
            if (!profile || !status || !alasan || !image) {
                alert('Mohon lengkapi semua kolom!');
                return;
            }

            const izinData = {
                nama: profile.nama,
                status: status,
                alasan: alasan,
                buktiFoto: image,
            };

            setIsLoading(true); // Set loading sebelum melakukan operasi tambah izin

            // Panggil fungsi untuk menambahkan izin absen
            await tambahIzinAbsen(izinData);

            setIsLoading(false); // Set loading kembali ke false setelah selesai
            setAlasan(""); // Reset input alasan setelah berhasil menambahkan izin
            setImage(null); // Reset input gambar setelah berhasil menambahkan izin

            alert('Izin berhasil ditambahkan!');
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error menambahkan izin absen:', error);
            alert('Gagal menambahkan izin absen. Silakan coba lagi.');
            setIsLoading(false); // Pastikan loading di-set false ketika terjadi kesalahan
        }
    };

    return (
        <ScrollView backgroundColor={'white'}>
            <Box bgColor={'white'}>
                <Box mt={3} height={130} borderRadius={10}>
                <Image m={1} alignSelf={'center'} source={require('../assets/icon_helpdesk.png')} style={{ width: 200, height: 150, borderRadius: 10 }} alt="Selamat Datang ICON"></Image>
                </Box>
                <Box px={4} py={10} pb={10}>
                    <Heading fontSize={13} fontWeight={'extrabold'} mb={2} color={'#181059'}>Nama Lengkap</Heading>
                    <Input value={profile && profile.nama ? profile.nama : "-"} placeholder="Masukkan Nama Lengkap" isDisabled={true} placeholderTextColor={'#636EFC'} />
                    <Heading mt={4} fontSize={13} fontWeight={'extrabold'} mb={2} color={'#181059'}>Status</Heading>
                    <Input value={status} isDisabled={true} onChangeText={(text) => setStatus(text)} placeholderTextColor={'#636EFC'} />
                    <Heading mt={4} fontSize={13} fontWeight={'extrabold'} mb={2} color={'#181059'}>Alasan</Heading>
                    <Input value={alasan} onChangeText={(text) => setAlasan(text)} placeholder="Masukkan Alasan" placeholderTextColor={'#181059'} />
                    <Heading mt={4} fontSize={13} fontWeight={'extrabold'} mb={2} color={'#181059'}>Upload Foto</Heading>
                    <Button backgroundColor={'#181059'} onPress={pickImage}>
                        <Text fontWeight="bold" color="white">Pilih Gambar</Text>
                    </Button>
                    {image && (
                        <Image
                            source={{ uri: image }}
                            alt="gambar"
                            size="lg"
                            resizeMode="cover"
                        />
                    )}
                    <Pressable onPress={handleTambahIzin}>
                        <Box
                            mt={3}
                            backgroundColor={'#181059'}
                            borderRadius={5}
                            alignItems={'center'}
                        >
                            <Text p={3} color={'white'} fontWeight={'extrabold'} fontSize={'md'} textAlign={'center'}>
                                {isLoading ? <Spinner size="sm" color="white" /> : "Simpan"}
                            </Text>
                        </Box>
                    </Pressable>
                </Box>
            </Box>
        </ScrollView>
    );
};

export default IzinKerja;
