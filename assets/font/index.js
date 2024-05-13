// File tema atau konfigurasi gaya Anda (misalnya: theme.js)
import { extendTheme } from 'native-base';
import { Platform } from 'react-native';

const PoppinsFont = Platform.select({
  ios: 'Poppins',
  android: 'Poppins-Regular', // Sesuaikan dengan file font yang Anda miliki di proyek Anda
});

const FontPoppins = extendTheme({
  fonts: {
    heading: PoppinsFont,
    body: PoppinsFont,
    mono: PoppinsFont,
  },
});

export default FontPoppins;
