import { Box, Heading, Text, Input, Pressable } from "native-base";
import { ImageBackground } from "react-native";
import React, {useState, useEffect} from "react";
import { useNavigation } from "@react-navigation/native";
import { registerUser } from "../../src/actions/auth_actions";

const Register = () => {
    const navigation = useNavigation();
    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("");

    const onRegister = async () => {
        try {
          // Check if all required fields are filled
          if (nama && email && password && status) {
            // Prepare user data for registration
            const userData = {
              nama: nama,
              email: email,
              status: status,
            };
    
            // Call registerUser function and wait for the result
            const user = await registerUser(userData, password);
    
            // If registration is successful, navigate to the login screen
            navigation.replace("Login");
          } else {
            // If any required field is missing, throw an error
            throw new Error("Data tidak lengkap");
          }
        } catch (error) {
          // Catch and handle errors that may occur during registration
          console.error("Error during registration:", error.message);
          toggleAlert(error.message);
        }
      };
    

    return (
        <Box flex={1}>
            <ImageBackground
                source={require('../../assets/gradient_3.jpg')}
                resizeMode="cover"
                style={{ flex: 1 }}
            >
                <Box py={15}>
                    <Heading color={'#0066FF'} mt={40} fontSize={28} mx={8}>Sign Up</Heading>
                    <Heading mx={8} mt={8} fontSize={14} fontWeight={'extrabold'} mb={2} color={'#0066FF'}>Nama Lengkap</Heading>
                    <Input label="Nama"
                        value={nama}
                        onChangeText={(nama) => setNama(nama)} mx={8} placeholder="Nama Lengkap" placeholderTextColor={'#0066FF'}  _light={{
                            borderColor: '#0066FF', // Ubah warna border di sini
                        }}/>

                    <Heading mx={8} mt={3} fontSize={14} fontWeight={'extrabold'} mb={2} color={'#0066FF'}>Username</Heading>
                    <Input label="Email"
                    value={email}
                    onChangeText={(email) => setEmail(email)} mx={8} placeholder="Username" placeholderTextColor={'#0066FF'} _light={{
                            borderColor: '#0066FF', // Ubah warna border di sini
                        }} />
                    <Heading mx={8} mt={3} fontSize={14} fontWeight={'extrabold'} mb={2} color={'#0066FF'}>Password</Heading>
                    <Input label="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={(password) => setPassword(password)} type="password" mx={8} placeholder="Password" placeholderTextColor={'#0066FF'} _light={{
                                    borderColor: '#0066FF', // Ubah warna border di sini
                                }} />
                    <Heading mx={8} mt={3} fontSize={14} fontWeight={'extrabold'} mb={2} color={'#0066FF'}>Status</Heading>
                    <Input label="Status"
                    
                    value={status}
                    onChangeText={(status) => setStatus(status)} mx={8} placeholder="Staus" placeholderTextColor={'#0066FF'} _light={{
                            borderColor: '#0066FF', // Ubah warna border di sini
                        }} />
                    <Pressable onPress={onRegister}>
                        <Box mx={8} mt={5} backgroundColor={'#0066FF'} borderRadius={5} alignItems={'center'}>
                            <Text p={3} color={'white'} fontWeight={'extrabold'} fontSize={'md'} textAlign={'center'}>
                                Simpan
                            </Text>
                        </Box>
                    </Pressable>
                    <Box flexDirection={'row'} mx={8} mt={3}  >
                        <Text fontWeight={'medium'} fontSize={12} color={'#0066FF'}>Sudah Mempunyai Akun? </Text>
                        <Pressable onPress={() => navigation.navigate('Login')}><Text  fontWeight={'medium'} fontSize={12} color={'#0066FF'} textDecorationLine={'underline'}>Login Disini</Text></Pressable>
                    </Box>
                </Box>
            </ImageBackground>
        </Box>
    )
};

export default Register;
