<template>
    <div class="topnav">
        <div class="">
  <router-link :to="{name:'IndexPage'}" class="w3-bar-item w3-left w3-hover-black w3-button w3-mobile w3-margin-left">imazii</router-link>
  <div class="w3-right w3-margin-right">
        <input type="text" placeholder="Search..">
  <a v-if="!user" href="#" class="w3-bar-item w3-button w3-mobile w3-hover-black w3-text" @click="signIn">signIn/signUp</a>
  <router-link :to="{name:'UserProfile'}" v-if="user" href="#" class="w3-bar-item w3-button w3-mobile w3-hover-black w3-text">{{user.displayName}}</router-link>
  <a v-if="user" href="#" class="w3-bar-item w3-button w3-mobile w3-hover-black w3-text" @click="signOut">signOut</a>
  </div>
</div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
export default {
    name:'Navbar',
    data(){
        return{
            user:null
        }
    },
    methods:{
        signIn(){
            let provider = new firebase.auth.GoogleAuthProvider()
            firebase.auth().signInWithPopup(provider)
            .then((cred)=>{
                this.user = cred.user
                this.user.id = cred.user.uid
                db.collection('users').doc(this.user.displayName).set({
                    userName:this.user.displayName,
                    images:[],
                    user_id:this.user.id
                }).then(()=>{
                this.$router.push({name:'UserProfile'})
                })
            })
        },
        signOut(){
            firebase.auth().signOut()
            .then(()=>{
                this.$router.push({name:'IndexPage'})
            })
        }
    },
    created(){
         firebase.auth().onAuthStateChanged((user) => {
      if(user){
        this.user = user
      } else {
        this.user = null
      }
    })    
    }
}
</script>

<style>
/* Add a black background color to the top navigation bar */
.topnav {
    overflow: hidden;
    background-color: #e9e9e9;
}

/* Style the links inside the navigation bar */
.topnav a {
    float: left;
    display: block;
    color: black;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    font-size: 17px;
}

/* Change the color of links on hover */
.topnav a:hover {
    background-color: #ddd;
    color: black;
}

/* Style the "active" element to highlight the current page */
.topnav a.active {
    background-color: #2196F3;
    color: white;
}

/* Style the search box inside the navigation bar */
.topnav input[type=text] {
    position: relative;
    padding: 6px;
    border: none;
    margin-top: 8px;
    margin-right: 16px;
    font-size: 17px;
}

/* When the screen is less than 600px wide, stack the links and the search field vertically instead of horizontally */
@media screen and (max-width: 600px) {
    .topnav a, .topnav input[type=text] {
        float: none;
        display: block;
        text-align: left;
        width: 100%;
        margin: 0;
        padding: 14px;
    }
    .topnav input[type=text] {
        border: 1px solid #ccc;
    }
}
</style>
