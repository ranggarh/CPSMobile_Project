import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "../../src/actions/auth_actions";
import { Box, Heading, Text, Input, Pressable, ScrollView } from "native-base";
import { ImageBackground } from "react-native";

const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loginError, setLoginError] = useState(""); // State untuk pesan kesalahan saat login tidak valid
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        setEmailError("");
        setPasswordError("");
        setLoginError(""); // Reset pesan kesalahan login
    
        try {
            if (!email) {
                setEmailError("Email Wajib Diisi.");
                return;
            }
    
            if (!password) {
                setPasswordError("Password Wajib Diisi.");
                return;
            }
    
            // Panggil loginUser
            const userData = await loginUser(email, password, navigation);
    
            // loginUser berhasil tanpa kesalahan
            // Karena navigasi telah ditangani di loginUser, tidak perlu lagi di sini
            
        } catch (error) {
            console.log("Error", error.message);
            if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
                setLoginError("Invalid email or password."); // Mengatur pesan kesalahan login tidak valid
            } else {
                setLoginError("Login Gagal, Silahkan Coba Lagi.");
            }
        }
    };

    return (
        <>
        
            <ImageBackground
                source={require('../../assets/gradient_3.jpg')}
                resizeMode="cover"
                style={{ flex: 1 }}
            >
            <ScrollView flex={1}>
                <Box py={15}>
                    <Heading color={'#0066FF'} fontSize={28} mt={40} mx={8}>Sign In</Heading>

                    {loginError ? ( // Menampilkan pesan kesalahan login tidak valid jika ada
                        <Text mx={8} mt={2} color="red.500" fontSize={14}>
                            {loginError}
                        </Text>
                    ) : null}

                    <Heading mx={8} mt={4} fontSize={14} fontWeight={'extrabold'} mb={2} color={'#0066FF'}>Email</Heading>
                    <Input
                        label="Email"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        mx={8}
                        placeholder="Email"
                        placeholderTextColor={'#0066FF'}
                        _light={{ borderColor: '#0066FF' }}
                    />
                    <Text mx={8} mt={1} color="red.500" fontSize={12}>
                        {emailError}
                    </Text>

                    <Heading mx={8} mt={1} fontSize={14} fontWeight={'extrabold'} mb={2} color={'#0066FF'}>Password</Heading>
                    <Input
                        label="Password"
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        mx={8}
                        placeholder="Password"
                        placeholderTextColor={'#0066FF'}
                        _light={{ borderColor: '#0066FF' }}
                        secureTextEntry={!showPassword} // Hide password if showPassword is false
                        InputRightElement={
                            <Pressable onPress={() => setShowPassword(!showPassword)}>
                                <Text color={'#0066FF'}>{showPassword ? 'Hide' : 'Show'}</Text>
                            </Pressable>
                        }
                    />
                    <Text mx={8} mt={1} color="red.500" fontSize={12}>
                        {passwordError}
                    </Text>

                    

                    <Pressable onPress={handleLogin}>
                        <Box mx={8} mt={4} backgroundColor={'#0066FF'} borderRadius={5} alignItems={'center'}>
                            <Text p={3} color={'white'} fontWeight={'extrabold'} fontSize={'md'} textAlign={'center'}>
                                Sign In
                            </Text>
                        </Box>
                    </Pressable>

                    <Box flexDirection={'row'} mx={8} mt={4}  >
                        <Text fontWeight={'medium'} fontSize={12} color={'#0066FF'}>Don't have an account? </Text>
                        <Pressable onPress={() => navigation.navigate('Register')}>
                            <Text fontWeight={'medium'} fontSize={12} color={'#0066FF'} textDecorationLine={'underline'}>
                                Sign Up Here
                            </Text>
                        </Pressable>
                    </Box>
                </Box>
                </ScrollView>
            </ImageBackground>
        
        </>
    )
};

export default Login;
