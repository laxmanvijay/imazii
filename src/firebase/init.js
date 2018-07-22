import firebase from 'firebase'

// Initialize Firebase
 var config = {
    apiKey: "AIzaSyDUAX0utQkckqxDOA_Irw4h8oSB6P379hw",
    authDomain: "findmybus-189414.firebaseapp.com",
    databaseURL: "https://findmybus-189414.firebaseio.com",
    projectId: "findmybus-189414",
    storageBucket: "findmybus-189414.appspot.com",
    messagingSenderId: "448419087209"
  };
  const firebaseapp = firebase.initializeApp(config);

  firebaseapp.firestore().settings({timestampsInSnapshots:true})

  export default firebaseapp.firestore()