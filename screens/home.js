import { Text, View } from "native-base";
import { Header } from "../components";

const Home = () =>{
  return(
    <View>
        <Header title={'Home'} />
        <Text>Hellow world</Text>
    </View>
  );
};

export default Home;