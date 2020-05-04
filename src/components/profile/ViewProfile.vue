<template>
    <div class="profile container">
        <div v-if="profile" class="card">
            <div class="deep-purple-text center">
            <h4>{{ profile.username }}'s Profile</h4>
            <p> Your name : {{ profile.name }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import db from '@/firebase/init'

export default {
    name: 'ViewProfile',
    data() {
        return {
            profile: null
        }
    },
    created() {
        let ref = db.collection('users')
        ref.doc(this.$route.params.id).get()
        .then(user => {
            this.profile = user.data()
            console.log(this.profile)
        })
    },

}
</script>

<style scoped>
.profile{
    max-width: 500px;
    margin-top: 40px;
}
</style>