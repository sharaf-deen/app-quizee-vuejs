import firebase from 'firebase'
import firestore from 'firebase/firestore'

var firebaseConfig = {
  apiKey: "AIzaSyAPkjMerPZQARYlWDx4xUvLPXJbGTESNO4",
  authDomain: "quiz-app-vue.firebaseapp.com",
  databaseURL: "https://quiz-app-vue.firebaseio.com",
  projectId: "quiz-app-vue",
  storageBucket: "quiz-app-vue.appspot.com",
  messagingSenderId: "952810765588",
  appId: "1:952810765588:web:f9494445222f76eb7e9601"
};
  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig);

  export default firebaseApp.firestore()