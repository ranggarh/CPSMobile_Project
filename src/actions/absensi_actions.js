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
        batasWaktuMasuk.setHours(8, 15, 0, 0); // Set jam 07:15 pagi
        const waktuMasuk = waktu.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

        // Tentukan status berdasarkan waktu masuk
        let status = 'Masuk';
        if (waktu > batasWaktuMasuk) {
            status = 'Alpa';
        }

        const hari = waktu.toLocaleString('id-ID', { weekday: 'long' });

        // Menambahkan data absensi baru dengan atribut lokasi, waktu masuk, dan status
        await FIREBASE.database()
            .ref(`absensi/${uid}`)
            .push({
                lokasiMasuk: lokasi,
                hari: hari,
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
export const getAbsensiData = async () => {
  try {
      // Mendapatkan data user dari local storage
      const userData = await getData('user');
      const uid = userData.uid;

      // Mendapatkan snapshot dari data absensi pengguna
      const absensiSnapshot = await FIREBASE.database().ref(`absensi/${uid}`).once('value');
      const absensiData = absensiSnapshot.val();

      // Array untuk menyimpan hasil data absensi
      const absensiArray = [];

      // Loop melalui setiap entri absensi dan memasukkannya ke dalam array
      for (const key in absensiData) {
          const absensi = absensiData[key];
          // Dapatkan status berdasarkan waktu masuk dan waktu pulang
          let status;
          if (absensi.waktuPulang) {
              status = 'Selesai';
          } else {
              status = 'Belum Selesai';
          }

          // Push data absensi ke dalam array
          absensiArray.push({
              nama: userData.nama, // Anda perlu menambahkan properti nama dalam data user
              hari: absensi.hari,
              waktuMasuk: absensi.waktuMasuk,
              waktuPulang: absensi.waktuPulang || '-', // Jika waktuPulang tidak ada, ganti dengan tanda strip (-)
              status: absensi.status
          });
      }

      // Kembalikan array yang berisi data absensi
      return absensiArray;
  } catch (error) {
      console.error('Error mengambil data absensi:', error);
      throw error;
  }
};

// Fungsi untuk memperbarui waktu pulang di setiap entri absen masuk
export const updateAbsensiPulang = async (lokasi, waktu, userLocation) => {
  try {
    const userData = await getData('user');
    const uid = userData.uid;

    // Mendapatkan data absen masuk terakhir
    const absensiRef = await FIREBASE.database().ref(`absensi/${uid}`).orderByKey().limitToLast(1).once('value');
    const absensiData = absensiRef.val();

    if (!absensiData) {
      console.error('Tidak ada data absensi yang ditemukan');
      throw new Error('Tidak ada data absensi yang ditemukan');
    }

    const lastAbsensiKey = Object.keys(absensiData)[0];

    // Periksa apakah absen masuk terakhir sudah memiliki waktu pulang
    if (absensiData[lastAbsensiKey].waktuPulang) {
      console.log('Absen masuk terakhir sudah memiliki waktu pulang');
      return false;
    }

    // Update waktu pulang dan lokasi pulang di absen masuk terakhir
    await FIREBASE.database().ref(`absensi/${uid}/${lastAbsensiKey}`).update({
      waktuPulang: waktu.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
      lokasiPulang: lokasi,
    });

    return true;
  } catch (error) {
    console.error('Error memperbarui data absensi pulang:', error);
    throw error;
  }
};





