import firebase from 'firebase'; 
// Initialize Firebase
var config = {
    apiKey: "AIzaSyARxZ5EDdSFUKDM0URxBRcM-_ng1KW_HZc",
    authDomain: "toronto-bike-race.firebaseapp.com",
    databaseURL: "https://toronto-bike-race.firebaseio.com",
    projectId: "toronto-bike-race",
    storageBucket: "toronto-bike-race.appspot.com",
    messagingSenderId: "777129192190"
};
firebase.initializeApp(config);

export default firebase;