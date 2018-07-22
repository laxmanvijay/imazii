<template>
<div class="w3-margin">
<form class="w3-container w3-card-4">
  <h2>Upload image</h2>
  <p>Choose an image to upload</p>

  <p><label>Name</label>
   <input type="text" class="w3-input" v-model="fileName" placeholder="enter a name" required/></p>

  <p><label>Image</label></p>
  <div class="fileinputs">
	<input type="file" name="img" id="img" @change="upload" class="file">
	<div class="fakefile">
		<input/>
		<button class="w3-button w3-teal">choose</button>
	</div>
  </div>
  <br>
  <br>
</form>
<p class="w3-green" v-if="feedback">{{feedback}}</p>
<h4>
    your images are:
</h4>
<div class="w3-row" >
    <div class="w3-third w3-border w3-border-black w3-margin" v-for="(img,index) in files" :key="index">
    <img @click="commentsPage(img)" width="100%" height="100%" :src="imglink+img.owner+'%2F'+img.image+urlparam" alt="">
    </div>
</div>
</div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
export default {
    name:'ListImages',
    data(){
        return{
            files:[],
            fileName:'',
            imglink:'https://firebasestorage.googleapis.com/v0/b/findmybus-189414.appspot.com/o/images%2F',
            urlparam:'?alt=media',
            feedback:null
        }
    },
    created(){
        db.collection('images').where('owner','==',firebase.auth().currentUser.displayName).get()
        .then((snapshot)=>{
            console.log(snapshot)
            snapshot.forEach(doc=>{
                this.files.push(doc.data())
            })
        })
    },
    methods:{
        upload(e){
            firebase.storage().ref().child('images')
            .child(firebase.auth().currentUser.displayName)
            .child(this.fileName)
            .put(e.target.files[0])
            .then((snapshot)=>{
                this.img = e.target.name
                console.log(snapshot)
                this.files.push(snapshot.ref.name)
                db.collection('images').doc().set({
                        image:this.fileName,
                        owner:firebase.auth().currentUser.displayName,
                        likes:0,
                        likes_by:[]
                })
                db.collection('users').doc(firebase.auth().currentUser.displayName).update({
                    images:this.files
                })
            })
        },
        commentsPage(e){
            this.$router.push({name:'CommentsPage',params:{name:e.image,user:e.owner}})
        }
    }
}
</script>

<style>
.upload{
    margin: auto 500px;
}
div.fileinputs {
	position: relative;
}

div.fakefile {
	position: absolute;
	top: 0px;
	left: 0px;
	z-index: 1;
}

input.file {
	position: relative;
	text-align: right;
	-moz-opacity:0 ;
	opacity: 0;
	z-index: 2;
}
</style>
