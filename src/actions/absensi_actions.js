import FIREBASE from '../config/FIREBASE';
import { getData } from '../utils/localStorage'; // Tambahkan impor ini

export const tambahIzinAbsen = async (izinData) => {
  try {
      const userData = await getData('user');
      const uid = userData.uid;

      // Upload foto bukti ke Firebase Storage
      const fotoUri = izinData.buktiFoto;
      const response = await fetch(fotoUri);
      const blob = await response.blob();
      const fotoRef = FIREBASE.storage().ref().child(`bukti/${uid}_${Date.now()}`);
      await fotoRef.put(blob);

      // Dapatkan URL foto yang diupload
      const waktu = new Date();
      const fotoUrl = await fotoRef.getDownloadURL();
      const hari = waktu.toLocaleString('id-ID', { weekday: 'long' });
      const waktuIzin = waktu.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

      // Tambahkan data izin ke Firebase Database
      await FIREBASE.database().ref(`absensi/${uid}`).push({
          hari: hari,
          waktuIzin: waktuIzin,
          nama: izinData.nama,
          jabatan: izinData.status,
          alasan: izinData.alasan,
          buktiFoto: fotoUrl,
          status: 'Izin',
      });

      return true;
  } catch (error) {
      console.error('Error menambahkan izin absen:', error);
      throw error;
  }
};


// Fungsi untuk menambahkan data absensi
export const tambahAbsensi = async (lokasi, waktu) => {
    try {
        // Mengambil uid pengguna dari local storage
        const userData = await getData('user');
        const uid = userData.uid;

        // Tentukan batas waktu maksimal untuk masuk (07:15 pagi WIB)
        const batasWaktuMasuk = new Date();
        batasWaktuMasuk.setHours(10, 0, 0, 0); // Set jam 07:15 pagi
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
          let izin = 0;
          for (const key in absensi) {
              if (absensi[key].status === 'Masuk') {
                  masuk++;
              } else if (absensi[key].status === 'Alpa') {
                  alpa++;
              } else if (absensi[key].status === 'Izin') {
                izin++;
            }
          }
          jumlahAbsensi[uid] = { masuk, alpa, izin };
      }

      return jumlahAbsensi;
  } catch (error) {
      console.error('Error mengambil data absensi:', error);
      throw error;
  }
};
// Fungsi untuk memperbarui waktu pulang di setiap entri absen masuk
// export const updateAbsensiPulang = async (lokasi, waktu, userLocation) => {
//   try {
//     const userData = await getData('user');
//     const uid = userData.uid;

//     // Mendapatkan data absen masuk terakhir
//     const absensiRef = await FIREBASE.database().ref(`absensi/${uid}`).orderByKey().limitToLast(1).once('value');
//     const absensiData = absensiRef.val();

//     if (!absensiData) {
//       console.error('Tidak ada data absensi yang ditemukan');
//       throw new Error('Tidak ada data absensi yang ditemukan');
//     }

//     const lastAbsensiKey = Object.keys(absensiData)[0];

//     // Periksa apakah absen masuk terakhir sudah memiliki waktu pulang
//     if (absensiData[lastAbsensiKey].waktuPulang) {
//       console.log('Absen masuk terakhir sudah memiliki waktu pulang');
//       return false;
//     }

//     // Update waktu pulang dan lokasi pulang di absen masuk terakhir
//     await FIREBASE.database().ref(`absensi/${uid}/${lastAbsensiKey}`).update({
//       waktuPulang: waktu.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
//       lokasiPulang: lokasi,
//     });

//     return true;
//   } catch (error) {
//     console.error('Error memperbarui data absensi pulang:', error);
//     throw error;
//   }
// };

export const updateAbsensiPulang = async (lokasi, waktu, userLocation) => {
  try {
    const userData = await getData('user');
    const uid = userData.uid;

    // Mendapatkan data absensi masuk terakhir
    const absensiRef = await FIREBASE.database().ref(`absensi/${uid}`).orderByKey().limitToLast(1).once('value');
    const absensiData = absensiRef.val();

    if (!absensiData) {
      console.error('Tidak ada data absensi yang ditemukan');
      throw new Error('Tidak ada data absensi yang ditemukan');
    }

    const lastAbsensiKey = Object.keys(absensiData)[0];
    const lastAbsensi = absensiData[lastAbsensiKey];

    // Periksa apakah absensi masuk terakhir memenuhi syarat untuk update pulang
    if (lastAbsensi.status === 'Izin') {
      console.log('Absensi masuk terakhir adalah status Izin, tidak bisa update pulang');
      return false;
    }

    if (lastAbsensi.waktuPulang) {
      console.log('Absensi masuk terakhir sudah memiliki waktu pulang');
      return false;
    }

    // Update waktu pulang dan lokasi pulang di absensi masuk terakhir
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



export const getRiwayatAbsensi = async () => {
  try {
    // Mendapatkan data user dari local storage
    const userData = await getData('user');
    const uid = userData.uid;
    const waktu = new Date();
    const hari = waktu.toLocaleString('id-ID', { weekday: 'long' });
    const waktuIzin = waktu.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

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

      // Periksa apakah ini data izin atau bukan
      if (absensi.status === 'Izin') {
        // Jika ini adalah data izin, tambahkan ke array riwayat absensi
        absensiArray.push({
          nama: userData.nama, // Anda perlu menambahkan properti nama dalam data user
          jenis: 'Izin', // Tambahkan jenis untuk membedakan dengan data absensi
          hari: hari,
          waktuIzin: waktuIzin,
          status: absensi.status,
          alasan: absensi.alasan, // Contoh: Anda bisa menambahkan alasan izin ke dalam riwayat
          buktiFoto: absensi.buktiFoto, // Contoh: URL foto bukti izin
        });
      } else {
        // Jika bukan data izin, maka ini adalah data absensi biasa
        absensiArray.push({
          nama: userData.nama, // Anda perlu menambahkan properti nama dalam data user
          jenis: 'Absensi', // Tambahkan jenis untuk membedakan dengan data izin
          hari: absensi.hari,
          waktuMasuk: absensi.waktuMasuk,
          waktuPulang: absensi.waktuPulang || '-', // Jika waktuPulang tidak ada, ganti dengan tanda strip (-)
          status: absensi.status,
        });
      }
    }

    // Kembalikan array yang berisi data absensi dan izin
    return absensiArray;
  } catch (error) {
    console.error('Error mengambil data absensi:', error);
    throw error;
  }
};



export const getTopTercepat = async () => {
  try {
    const absensiSnapshot = await FIREBASE.database().ref('absensi').once('value');
    const absensiData = absensiSnapshot.val();

    const absensiArray = [];

    for (const uid in absensiData) {
      for (const key in absensiData[uid]) {
        const absensi = absensiData[uid][key];

        if (absensi.status === 'Masuk') {
          try {
            const userUid = uid; // UID pengguna
            const userSnapshot = await FIREBASE.database().ref(`users/${userUid}`).once('value');
            const userData = userSnapshot.val();

            if (userData) {
              absensiArray.push({
                nama: userData.nama || '-', // Gunakan userData.nama jika tersedia, jika tidak gunakan "-"
                hari: absensi.hari,
                waktuMasuk: absensi.waktuMasuk,
                waktuPulang: absensi.waktuPulang || '-',
                status: absensi.status,
              });

              console.log(`Absensi entry for UID ${userUid} (status: ${absensi.status}):`, absensi); // Log absensi entry
            } else {
              console.error(`No user data found for UID ${userUid}`);
            }
          } catch (error) {
            console.error(`Error fetching user data for UID ${userUid}:`, error);
          }
        }
      }
    }

    return absensiArray;
  } catch (error) {
    console.error('Error fetching absensi data:', error);
    throw error;
  }
};















