import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "../../src/actions/auth_actions";
import { Box, Heading, Text, Input, Pressable, ScrollView, Spinner, StatusBar } from "native-base";
import { Ionicons } from "@expo/vector-icons";


const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loginError, setLoginError] = useState(""); // State untuk pesan kesalahan saat login tidak valid
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // State untuk loading

    const handleLogin = async () => {
        setEmailError("");
        setPasswordError("");
        setLoginError("");
        setLoading(true); // Set loading menjadi true saat proses login dimulai

        try {
            if (!email) {
                setEmailError("Email Wajib Diisi.");
                setLoading(false); // Set loading menjadi false
                return;
            }
    
            if (!password) {
                setPasswordError("Password Wajib Diisi.");
                setLoading(false); // Set loading menjadi false
                return;
            }
    
            const userData = await loginUser(email, password, navigation);
            setLoading(false); // Set loading menjadi false setelah proses login selesai

        } catch (error) {
            console.log("Error", error.message);
            if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
                setLoginError("Invalid email or password.");
            } else {
                setLoginError("Login Gagal, Silahkan Coba Lagi.");
            }
            setLoading(false); // Set loading menjadi false jika terjadi error
        }
    };

    return (
        <>
                <ScrollView flex={1} backgroundColor={'white'} >
                <StatusBar backgroundColor={'#0F0279'} barStyle="white"/>
                    <Box py={15}>
                        <Heading color={'#0F0279'} fontSize={28} mt={40} mx={8}>Sign In</Heading>

                        {loginError ? ( // Menampilkan pesan kesalahan login tidak valid jika ada
                            <Text mx={8} mt={2} color="red.500" fontSize={14}>
                                {loginError}
                            </Text>
                        ) : null}

                        <Heading mx={8} mt={4} fontSize={14} fontWeight={'extrabold'} mb={2} color={'#0F0279'}>Email</Heading>
                        <Input
                            label="Email"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            mx={8}
                            placeholder="Email"
                            placeholderTextColor={'#0F0279'}
                            _light={{ borderColor: '#0F0279' }}
                        />
                            <Text mx={8} mt={1} color="red.500" fontSize={12}>
                                {emailError}
                            </Text>

                        <Heading mx={8} mt={1} fontSize={14} fontWeight={'extrabold'} mb={2} color={'#0F0279'}>Password</Heading>
                        <Input
                            label="Password"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            mx={8}
                            placeholder="Password"
                            placeholderTextColor={'#0F0279'}
                            _light={{ borderColor: '#0F0279' }}
                            secureTextEntry={!showPassword} // Hide password if showPassword is false
                            InputRightElement={
                                <Pressable onPress={() => setShowPassword(!showPassword)}>
                                    <Text mr={3} color={'#0F0279'}>{showPassword ? <Ionicons size={20} name="eye-off"></Ionicons> : <Ionicons size={20} name="eye"></Ionicons>}</Text>
                                </Pressable>
                            }
                        />
                            <Text mx={8} mt={1} color="red.500" fontSize={12}>
                                {passwordError}
                            </Text>

                        

                        {loading ? ( // Tampilkan spinner jika loading
                            <Box mx={8} mt={4} alignItems={'center'}>
                                <Spinner color="#0F0279" />
                            </Box>
                        ) : (
                            <Pressable onPress={handleLogin}>
                                <Box mx={8} mt={4} backgroundColor={'#0F0279'} borderRadius={5} alignItems={'center'}>
                                    <Text p={3} color={'white'} fontWeight={'extrabold'} fontSize={'md'} textAlign={'center'}>
                                        Sign In
                                    </Text>
                                </Box>
                            </Pressable>
                        )}

                        <Box flexDirection={'row'} mx={8} mt={4}  >
                            <Text fontWeight={'medium'} fontSize={12} color={'#0F0279'}>Don't have an account? </Text>
                        
                                <Pressable onPress={() => navigation.navigate('Register')}>
                                    <Text fontWeight={'medium'} fontSize={12} color={'#0F0279'} textDecorationLine={'underline'}>
                                        Sign Up Here
                                    </Text>
                                </Pressable>
                        </Box>
                    </Box>
                </ScrollView>
        
        </>
    )
};

export default Login;
