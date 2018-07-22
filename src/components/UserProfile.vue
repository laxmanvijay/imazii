<template>
    <div>
    <h1>welcome {{user.displayName}}</h1>
    <ListImages/>
    </div>
</template>

<script>
import firebase from 'firebase'
import ListImages from './ListImages'
export default {
    name:'UserProfile',
    components:{
        ListImages
    },
    data(){
        return {
            user:null
        }
    },
    methods:{

    },
    created(){
        this.user=firebase.auth().currentUser
    }
}
</script>

<style>

</style>
