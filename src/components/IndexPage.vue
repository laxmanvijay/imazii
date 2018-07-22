<template>
<div>
  <div class="index">
   <h2>Latest Pics</h2>
  </div>
  <div class="w3-row" >
  <div class="w3-third w3-margin w3-border w3-border-black" v-for="(img,index) in files" :key="index">
    <img @click="commentsPage(img)" :src="imglink+img.owner+'%2F'+img.image+urlparam" alt="" width="100%" height="100%">
  </div>
  </div>
</div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
export default {
  name: 'IndexPage',
  data () {
    return {
      files:[],
      imglink:'https://firebasestorage.googleapis.com/v0/b/findmybus-189414.appspot.com/o/images%2F',
      urlparam:'?alt=media',
    }
  },
  methods:{
    commentsPage(img){
      this.$router.push({name:'CommentsPage',params:{name:img.image,user:img.owner}})
    }
  },
  created(){
    db.collection('images').get()
    .then(snapshot=>{
      snapshot.forEach(doc => {
        this.files.push(doc.data())
      });
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.imageGrid .tile:hover:before {
  display: none;
}

.imageGrid .tile .textWrapper {
  text-align: center;
  vertical-align: middle;
  width: 80%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: .75em;
}

.imageGrid .tile .textWrapper .content {
  display: none;
}

.imageGrid .tile:hover .textWrapper .content {
  display: block;
}

.imageGrid .tile:hover .textWrapper .content h2 {
  margin: 0;
}

@media (max-width: 1000px) {
  .imageGrid .tile {
    width: 50%;
  }
}
 
@media (max-width: 700px) {
  .imageGrid .tile {
    width: 100%;
  }
  
}
</style>

