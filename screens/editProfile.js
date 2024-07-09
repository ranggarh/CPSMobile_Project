import { Box, Avatar, ScrollView, Heading, Input, Button, Text, Pressable, Image, Spinner} from "native-base";
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from "react";
import { getData } from "../src/utils/localStorage";
import { updateUserProfile } from "../src/actions/auth_actions";
import { useNavigation } from "@react-navigation/native";

const EditProfil = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    // State untuk data profil
    const [profile, setProfile] = useState(null);
    const [email, setEmail] = useState(null);

    // State untuk data yang akan diubah
    const [alamat, setAlamat] = useState("");
    const [nohp, setNohp] = useState("");
    const [status, setStatus] = useState("");
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchData(); // Ambil data profil saat komponen dimuat
        requestMediaLibraryPermission(); // Minta izin akses ke galeri foto saat komponen dimuat
    }, []);

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

    // Fungsi untuk mengambil data profil
    const fetchData = async () => {
        try {
            const userData = await getData('user');
            setProfile(userData);
            setEmail(userData.email);
            setAlamat(userData.alamat);
            setNohp(userData.nohp);
            setStatus(userData.status);
            setImage(userData.image);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };


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

    // Fungsi untuk validasi kolom
    const validateFields = () => {
        let isValid = true;

        // Validasi alamat
        if (!alamat.trim()) {
            isValid = false;
        }

        // Validasi nomor handphone
        if (!nohp.trim()) {
            isValid = false;
        }

        // Validasi status
        if (!status.trim()) {
            isValid = false;
        }

        // Validasi gambar
        if (!image) {
            isValid = false;
        }

        return isValid;
    };

    // Fungsi untuk menyimpan data yang diubah
    const onUpdate = async () => {
        try {
            if (validateFields()) {
                setIsLoading(true);
                const userData = {
                    alamat: alamat,
                    nohp: nohp,
                    status: status,
                    image:image,
                    // Tambahkan atribut lain jika diperlukan
                };

                await updateUserProfile(profile.uid, userData); // Perbarui data profil
                navigation.navigate('Profile'); // Kembali ke halaman profil setelah data diperbarui
            } else {
                // Tampilkan pesan kesalahan jika ada kolom yang belum diisi
                alert('Mohon lengkapi semua kolom!');
            }
        } catch (error) {
            console.error("Error updating profile:", error.message);
            alert('Gagal memperbarui profil. Silakan coba lagi.');
        } finally {
            setIsLoading(false); // Set isLoading to false after registration attempt
        }
    };

    return (
        <ScrollView backgroundColor={'white'}>
            <Box bgColor={'white'}>
                <Box mt={3} height={130} borderRadius={10}>
                <Avatar alignSelf={'center'} size="120" bg="blue.500" source={image ? { uri: image } : require("../assets/profile.jpg")} />
                </Box>

                <Box px={4} pb={10}>
                    <Heading fontSize={13} fontWeight={'extrabold'}  mb={2} color={'#181059'}>Nama Lengkap</Heading>
                    <Input value={profile && profile.nama ? profile.nama : "-"} placeholder="Masukkan Nama Lengkap" isDisabled={profile && profile.nama ? true : false}  placeholderTextColor={'#181059'} />
                    <Heading mt={4} fontSize={13} fontWeight={'extrabold'} mb={2} color={'#181059'}>Username</Heading>
                    <Input value={email} placeholder="Masukkan Email" isDisabled={email ? true : false} placeholderTextColor={'#181059'} />
                    <Heading mt={4} fontSize={13} fontWeight={'extrabold'} mb={2} color={'#181059'}>Alamat</Heading>
                    <Input value={alamat} placeholder="Masukkan Alamat"  onChangeText={(text) => setAlamat(text)}  placeholderTextColor={'#181059'} />
                    <Heading mt={4} fontSize={13} fontWeight={'extrabold'} mb={2} color={'#181059'}>Nomor Handphone</Heading>
                    <Input value={nohp}  onChangeText={(text) => setNohp(text)} placeholder="Masukkan Nomor Handphone" placeholderTextColor={'#181059'} />
                    <Heading mt={4} fontSize={13} fontWeight={'extrabold'} mb={2} color={'#181059'}>Status</Heading>
                    <Input value={status} isDisabled={status ? true : false} onChangeText={(text) => setStatus(text)} placeholder="Status Kerja" placeholderTextColor={'#181059'} />
                    <Heading mt={4} fontSize={13} fontWeight={'extrabold'} mb={2} color={'#181059'}>Upload Foto</Heading>
                    <Button backgroundColor={'#181059'} onPress={pickImage}>
                        <Text fontWeight="bold" color="white">Pilih Gambar</Text>
                    </Button>
                    {image && (
                        <Image
                            source={{ uri: image }}
                            alt="gambarwisata"
                            size="lg"
                            resizeMode="cover"
                        />
                    )}
                    <Pressable onPress={onUpdate} >
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

export default EditProfil;
