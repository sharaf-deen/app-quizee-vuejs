<template>
    <form @submit.prevent="updateProfile" class="row">
        <div class="col s12 m12">
            <div class="card-panel center">
                <button class="btn-floating waves-effect waves-light pink material-icons delete" @click="closeEditProfile">close</button>
                <p class="deep-purple-text">Update your Account</p>
                <div>
                    <label for="name">Full Name:</label>
                    <input type="text" name="name" v-model="profile.name">
                </div>
                <!-- <div>
                    <label for="username">Username:</label>
                    <input type="text" name="username" v-model="profile.username">
                </div> -->
                <br>
                <div class="field center">
                    <button class="btn deep-purple white-text btn-small">Save changes</button>
                </div>
            </div>
        </div>
    </form>
</template>


<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import slugify from 'slugify'



export default {
    name: 'EditProfile',
    data() {
        return {
            user: null,
            name: null,
            username: null,
            profile: null
        }
    },
    

    methods: {
        closeEditProfile() {
            this.$emit('closeEditProfile')
        },
        updateProfile() {
            db.collection('users').doc(this.profile.id).update(this.profile)
            .then(() => {
                console.log('Success');
                this.$alert('Your profil has been updated successfuly!');
                this.watcher();
            }).catch(err => {
                console.log(err)
            })
        },
        watcher() {
            db.collection("users")
            .onSnapshot((querySnapshot) => {
            this.users = [];
            querySnapshot.forEach((doc) => {
                this.users.push(doc);
            });
            });
        }
    },
    created() {
        let user = firebase.auth().currentUser
        // console.log(user)
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                this.user = user
                db.collection('users').where('user_id', '==', user.uid).get()
                .then(snapshot => {
                snapshot.forEach((doc) => {
                this.profile = doc.data();
                this.profile.id = doc.id
                console.log(this.profile)
                console.log(this.profile.id)
            })
            })
            } else {
                this.user = null
            };
            
            // console.log(user)
        });
        
    }
}
</script>