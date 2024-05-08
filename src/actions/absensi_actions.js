import FIREBASE from '../config/FIREBASE';
import { getData } from '../utils/localStorage'; // Tambahkan impor ini

export const tambahAbsensi = async (lokasi, waktu) => {
    try {
      // Mengambil uid pengguna dari local storage
      const userData = await getData('user');
      const uid = userData.uid;
  
      // Tentukan batas waktu maksimal untuk masuk (07:15 pagi WIB)
      const batasWaktuMasuk = new Date();
      batasWaktuMasuk.setHours(7, 15, 0, 0); // Set jam 07:15 pagi
      const waktuMasuk = waktu.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  
      // Tentukan status berdasarkan waktu masuk
      let status = 'Masuk';
      if (waktu > batasWaktuMasuk) {
        status = 'Alpa';
      }
  
      // Menambahkan data absensi baru dengan atribut lokasi, waktu masuk, dan status
      await FIREBASE.database()
        .ref(`absensi/${uid}`)
        .push({
          lokasi: lokasi,
          waktuMasuk: waktuMasuk,
          status: status,
        });
  
      return true;
    } catch (error) {
      console.error('Error menambahkan data absensi:', error);
      throw error;
    }
  };
  

export const updateAbsensiPulang = async (lokasi, waktu) => {
  try {
    // Mengambil uid pengguna dari local storage
    const userData = await getData('user');
    const uid = userData.uid;

    // Mengambil data absensi terakhir
    const absensiRef = await FIREBASE.database().ref(`absensi/${uid}`).orderByChild('waktuPulang').limitToLast(1).once('value');
    const absensiData = absensiRef.val();

    // Memperbarui waktu pulang pada data absensi terakhir
    if (absensiData) {
      const absensiKey = Object.keys(absensiData)[0]; // Mengambil kunci data absensi
      await FIREBASE.database()
        .ref(`absensi/${uid}/${absensiKey}`)
        .update({
          waktuPulang: waktu.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }), // Menggunakan waktu lokal Jakarta
        });

      return true;
    } else {
      console.error('Tidak ada data absensi yang ditemukan');
      throw new Error('Tidak ada data absensi yang ditemukan');
    }
  } catch (error) {
    console.error('Error memperbarui data absensi pulang:', error);
    throw error;
  }
};
