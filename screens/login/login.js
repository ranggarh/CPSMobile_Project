import { Box, Heading, Text, Input, Pressable } from "native-base";
import { ImageBackground } from "react-native";
import React, {useState, useEffect} from "react";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "../../src/actions/auth_actions";

const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const toggleAlert = (message) => {
        setShowAlert(!showAlert);
        setAlertMessage(message);
    };

    const handleLogin = () => {
        if (email && password) {
        loginUser(email, password, navigation)
            .then((user) => {
            if (user.status === 'admin') {
                navigation.replace("AdminTabs"); // Replace with your admin route
            } else {
                navigation.replace("Tabs"); // Replace with your user route
            }
            })
            .catch((error) => {
            console.log("Error", error.message);
            toggleAlert(error.message);
            });
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
                    <Heading color={'#0066FF'} fontSize={28} mt={40} mx={8}>Sign In</Heading>
                    <Heading mx={8} mt={8} fontSize={14} fontWeight={'extrabold'} mb={2} color={'#0066FF'}>Username</Heading>
                    <Input label="Email" value={email} onChangeText={(text) => setEmail(text)} mx={8} placeholder="Email" placeholderTextColor={'#0066FF'}  _light={{
                            borderColor: '#0066FF', // Ubah warna border di sini
                        }}/>
                    <Heading mx={8} mt={3} fontSize={14} fontWeight={'extrabold'} mb={2} color={'#0066FF'}>Password</Heading>
                    <Input label="password" onChangeText={(text) => setPassword(text)} value={password} mx={8} placeholder="Password" placeholderTextColor={'#0066FF'} _light={{
                            borderColor: '#0066FF', // Ubah warna border di sini
                        }} />
                    <Pressable onPress={handleLogin}>
                        <Box mx={8} mt={5} backgroundColor={'#0066FF'} borderRadius={5} alignItems={'center'}>
                            <Text p={3} color={'white'} fontWeight={'extrabold'} fontSize={'md'} textAlign={'center'}>
                                Simpan
                            </Text>
                        </Box>
                    </Pressable>
                    <Box flexDirection={'row'} mx={8} mt={4}  >
                        <Text fontWeight={'medium'} fontSize={12} color={'#0066FF'}>Belum Mempunyai Akun? </Text>
                        <Pressable onPress={()=> navigation.navigate('Register')} ><Text  fontWeight={'medium'} fontSize={12} color={'#0066FF'} textDecorationLine={'underline'}>Daftar Disini</Text></Pressable>
                    </Box>
                </Box>
            </ImageBackground>
            {showAlert && (
                <Modal isOpen={showAlert} onClose={() => toggleAlert()}>
                    <ModalBackdrop />
                    <Alert status="error" w="90%" mx={4}>
                    <AlertText fontWeight="bold">Error!</AlertText>
                    <AlertText>{alertMessage}</AlertText>
                    </Alert>
                </Modal>
                )}
        </Box>
    )
};

export default Login;
