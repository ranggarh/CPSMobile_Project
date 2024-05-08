import { Box, Heading, Text, Input, Pressable } from "native-base";
import { ImageBackground } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { registerUser } from "../../src/actions/auth_actions";

const Register = () => {
    const navigation = useNavigation();
    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("");

    // State for error messages
    const [namaError, setNamaError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [statusError, setStatusError] = useState("");
    const [registerError, setRegisterError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Function to validate input fields
    const validateFields = () => {
        let isValid = true;

        // Reset error messages
        setNamaError("");
        setEmailError("");
        setPasswordError("");
        setStatusError("");

        // Validate nama
        if (!nama.trim()) {
            setNamaError("Nama harus diisi");
            isValid = false;
        }

        // Validate email
        if (!email.trim()) {
            setEmailError("Email harus diisi");
            isValid = false;
        }

        // Validate password
        if (!password.trim()) {
            setPasswordError("Password harus diisi");
            isValid = false;
        }

        // Validate status
        if (!status.trim()) {
            setStatusError("Status harus diisi");
            isValid = false;
        }

        return isValid;
    };

    // Function to handle registration
    const onRegister = async () => {
        try {
            // Validate fields
            if (validateFields()) {
                // Prepare user data for registration
                const userData = {
                    nama: nama,
                    email: email,
                    status: status,
                };

                // Call registerUser function and wait for the result
                await registerUser(userData, password);

                // If registration is successful, navigate to the login screen
                navigation.replace("Login");
            }
        } catch (error) {
            // Catch and handle errors that may occur during registration
            console.error("Error during registration:", error.message);
            setRegisterError(error.message);
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
                        onChangeText={(nama) => setNama(nama)}
                        mx={8}
                        placeholder="Nama Lengkap"
                        placeholderTextColor={'#0066FF'}
                        _light={{ borderColor: '#0066FF' }}
                    />
                    {namaError ? <Text mx={8} mt={1} color="red.500">{namaError}</Text> : null}

                    <Heading mx={8} mt={3} fontSize={14} fontWeight={'extrabold'} mb={2} color={'#0066FF'}>Username</Heading>
                    <Input label="Email"
                        value={email}
                        onChangeText={(email) => setEmail(email)}
                        mx={8}
                        placeholder="Username"
                        placeholderTextColor={'#0066FF'}
                        _light={{ borderColor: '#0066FF' }}
                    />
                    {emailError ? <Text mx={8} mt={1} color="red.500">{emailError}</Text> : null}

                    <Heading mx={8} mt={3} fontSize={14} fontWeight={'extrabold'} mb={2} color={'#0066FF'}>Password</Heading>
                    <Input label="Password"
                        
                        value={password}
                        onChangeText={(password) => setPassword(password)}
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
                    {passwordError ? <Text mx={8} mt={1} color="red.500">{passwordError}</Text> : null}

                    <Heading mx={8} mt={3} fontSize={14} fontWeight={'extrabold'} mb={2} color={'#0066FF'}>Status</Heading>
                    <Input label="Status"
                        value={status}
                        onChangeText={(status) => setStatus(status)}
                        mx={8}
                        placeholder="Status"
                        placeholderTextColor={'#0066FF'}
                        _light={{ borderColor: '#0066FF' }}
                    />
                    {statusError ? <Text mx={8} mt={1} color="red.500">{statusError}</Text> : null}

                    <Pressable onPress={onRegister}>
                        <Box mx={8} mt={5} backgroundColor={'#0066FF'} borderRadius={5} alignItems={'center'}>
                            <Text p={3} color={'white'} fontWeight={'extrabold'} fontSize={'md'} textAlign={'center'}>
                                Simpan
                            </Text>
                        </Box>
                    </Pressable>
                    {registerError ? <Text mx={8} mt={1} color="red.500">{registerError}</Text> : null}

                    <Box flexDirection={'row'} mx={8} mt={3}  >
                        <Text fontWeight={'medium'} fontSize={12} color={'#0066FF'}>Sudah Mempunyai Akun? </Text>
                        <Pressable onPress={() => navigation.navigate('Login')}>
                            <Text  fontWeight={'medium'} fontSize={12} color={'#0066FF'} textDecorationLine={'underline'}>Login Disini</Text>
                        </Pressable>
                    </Box>
                </Box>
            </ImageBackground>
        </Box>
    )
};

export default Register;