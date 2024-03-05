import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { Box, HStack, Heading, Pressable, Image } from "native-base";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const Header = ({ title, withBack = false }) => {
  const warnaHeaderBerita = "#28AA9B"
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <StatusBar barStyle="light" backgroundColor={"#0383A2"} />
      <Box bg={"#0383A2"} p={"4"}>
        <HStack justifyContent="space-between" alignItems="center">
          <HStack alignItems="center">
            {!withBack ? (
              <>
                
              </>
            ) : (
              <Pressable
                activeOpacity={0.5}
                onPress={() => navigation.goBack()}
              >
                <Box mr={"3"}>
                  <Ionicons name="arrow-back-outline" size={32} color="white" />
                </Box>
              </Pressable>
            )}
            <Heading color={"white"}>{title}</Heading>
          </HStack>
        </HStack>
      </Box>
    </SafeAreaView>
  );
};

export default Header;