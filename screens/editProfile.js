import { Box, Avatar, ScrollView, Heading, Input, Button, Text, Pressable, Image } from "native-base";
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from "react";

const EditProfil = () => {
    const [image, setImage] = useState(null);

    useEffect(() => {
        // Request permission to access the device's photo library
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        })();
    }, []);

    const pickImage = async () => {
        try {
            // Launch the image picker
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.cancelled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    return (
        <ScrollView
                backgroundColor={'white'}
                 // Memulai scrollview dari bawah
            >
        <Box bgColor={'white'}>
            <Box mt={3} height={130} borderRadius={10} >
                <Avatar alignSelf={'center'} size="120" bg="blue.500" source={require("../assets/profile.png")} />
            </Box>
            
                <Box px={4} pb={10}>
                    <Heading fontSize={13} fontWeight={'extrabold'}  mb={2} color={'#636EFC'}>Nama Lengkap</Heading>
                    <Input placeholder="Masukkan Nama Lengkap" placeholderTextColor={'#636EFC'} />
                    <Heading mt={4} fontSize={13} fontWeight={'extrabold'} mb={2} color={'#636EFC'}>Username</Heading>
                    <Input placeholder="Username" placeholderTextColor={'#636EFC'} />
                    <Heading mt={4} fontSize={13} fontWeight={'extrabold'} mb={2} color={'#636EFC'}>Alamat</Heading>
                    <Input placeholder="Masukkan Alamat" placeholderTextColor={'#636EFC'} />
                    <Heading mt={4} fontSize={13} fontWeight={'extrabold'} mb={2} color={'#636EFC'}>Nomor Handphone</Heading>
                    <Input placeholder="Masukkan Nomor Handphone" placeholderTextColor={'#636EFC'} />
                    <Heading mt={4} fontSize={13} fontWeight={'extrabold'} mb={2} color={'#636EFC'}>Status</Heading>
                    <Input placeholder="Status Kerja" placeholderTextColor={'#636EFC'} />
                    <Heading mt={4} fontSize={13} fontWeight={'extrabold'} mb={2} color={'#636EFC'}>Upload Foto</Heading>
                    <Button backgroundColor={'#0066FF'} onPress={pickImage}>
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
                    <Pressable>
                        <Box mt={3} backgroundColor={'#0066FF'} borderRadius={5} alignItems={'center'}>
                            <Text p={3} color={'white'} fontWeight={'extrabold'} fontSize={'md'} textAlign={'center'}>
                                Simpan
                            </Text>
                        </Box>
                    </Pressable>
                </Box>
            
        </Box>
        </ScrollView>
    )
};

export default EditProfil;
