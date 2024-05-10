import FIREBASE from '../config/FIREBASE';
import { getData } from '../utils/localStorage'; // Tambahkan impor ini

// Fungsi untuk menambahkan data absensi
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

// Fungsi untuk mengambil data absensi setiap pengguna
export const getAbsensiData = async () => { // Mengganti nama fungsi menjadi getAbsensiData
  try {
      const absensiSnapshot = await FIREBASE.database().ref(`absensi`).once('value');
      const absensiData = absensiSnapshot.val();

      // Menghitung jumlah masuk dan alpa untuk setiap pengguna
      const jumlahAbsensi = {};
      for (const uid in absensiData) {
          const absensi = absensiData[uid];
          let masuk = 0;
          let alpa = 0;
          for (const key in absensi) {
              if (absensi[key].status === 'Masuk') {
                  masuk++;
              } else if (absensi[key].status === 'Alpa') {
                  alpa++;
              }
          }
          jumlahAbsensi[uid] = { masuk, alpa };
      }

      return jumlahAbsensi;
  } catch (error) {
      console.error('Error mengambil data absensi:', error);
      throw error;
  }
};

// Fungsi untuk memperbarui waktu pulang
export const updateAbsensiPulang = async (lokasi, waktu) => {
  try {
    const userData = await getData('user');
    const uid = userData.uid;

    const absensiRef = await FIREBASE.database().ref(`absensi/${uid}`).orderByChild('waktuPulang').limitToLast(1).once('value');
    const absensiData = absensiRef.val();

    if (absensiData) {
      const absensiKey = Object.keys(absensiData)[0];
      await FIREBASE.database()
        .ref(`absensi/${uid}/${absensiKey}`)
        .update({
          waktuPulang: waktu.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
          lokasiPulang: lokasi, // Menambahkan data lokasi pulang
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

