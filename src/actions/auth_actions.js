import { Alert } from "react-native";
import FIREBASE from "../config/FIREBASE";
import { clearStorage, getData, storeData } from "../utils/localStorage";

export const registerUser = async (data, password) => {
  try {
    const success = await FIREBASE.auth().createUserWithEmailAndPassword(data.email, password);

    const dataBaru = {
      ...data,
      uid: success.user.uid,
    };

    await FIREBASE.database()
      .ref("users/" + success.user.uid)
      .set(dataBaru);
    //Local storage(Async Storage)
    storeData("user", dataBaru);
    return dataBaru;
  } catch (error) {
    throw error;
  }
};

// authAction.js

export const loginUser = async (email, password, navigation) => {
  try {
    const success = await FIREBASE.auth().signInWithEmailAndPassword(email, password);
    const resDB = await FIREBASE.database()
      .ref("/users/" + success.user.uid)
      .once("value");

    if (resDB.val()) {
      const userData = resDB.val();

      // Check the user's role
      if (userData.status === 'admin') {
        // Navigate to the admin screen
        navigation.replace("AdminTabs"); // Update with your admin navigation route
      } else {
        // Navigate to the user screen
        navigation.replace("Tabs"); // Update with your user navigation route
      }

      // Local storage (Async Storage)
      await storeData("user", userData);

      return userData;
    } else {
      throw new Error("User data not found");
    }
  } catch (error) {
    throw error;
  }
};


export const logoutUser = () => {
  FIREBASE.auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      clearStorage();
    })
    .catch((error) => {
      // An error happened.
      alert(error);
    });
};