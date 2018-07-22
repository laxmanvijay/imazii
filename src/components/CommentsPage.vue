    <template>
<div>
    <div style="width:200px" class="w3-margin w3-border w3-border-black">
    <h3>image: {{this.$route.params.name}}</h3>
    <h4>by: {{this.$route.params.user}}</h4>
    </div>
    <img :src="imglink+this.$route.params.name + urlparam" alt="" class="w3-margin" width="95%" height="700px">
    <div style="width:150px" class="w3-margin w3-border w3-border-blue">
    Likes:{{this.imgLikes}}
    <button class="w3-button w3-blue" v-if="!imgLiked" @click="updateImagelike">Like</button>
    <button class="w3-button w3-blue" v-if="imgLiked" @click="updateImageUnlike">UnLike</button>
    </div>
    <div class="w3-margin w3-border w3-border-blue">
    <h1 class="w3-text w3-margin">Comments:</h1>
    <div style="width:550px" class="w3-margin w3-border w3-border-blue">
    <form class="w3-container" @submit.prevent="addComment">
        <label for="comment" class="w3-text"><h3>Add comment</h3></label>
        <input style="width:500px" type="text" class="w3-input" placeholder="enter something..." v-model="comment.content">
    <br> 
    </form>
    </div>
    <div class="w3-container" v-for="(comment,index) in comments" :key="index">
        <h4 class=" w3-text w3-text-blue"><b>{{comment.from}}:</b></h4>
        <p class=" time">{{moment(comment.timestamp).format('lll')}}</p>
        <h3>{{comment.content}}</h3>
        <p>likes: {{comment.likes}}</p>
        <button class="w3-button w3-blue" v-if="!comment.likes_by.includes(firebase.auth().currentUser.displayName)" @click="updateCommentLike(comment)">Like</button>
        <button class="w3-button w3-blue" v-if="comment.likes_by.includes(firebase.auth().currentUser.displayName)" @click="updateCommentUnlike(comment)">Unlike</button>
        <div class="w3-container">
        <p class="w3-text w3-large">Reply:</p>
        <div class="w3-row">
        <input class="w3-third w3-left w3-input" placeholder="reply..." v-if="reply_flag" id="index" type="text" v-model="reply">
        <button class="w3-rest w3-button w3-blue" @click="getReply(comment)">send</button>
        </div>
        </div><br>
        <div style="margin:45px" v-for="(repl,index) in comment.reply" :key="index">
            <h4 class="w3-text w3-text-blue"><b>{{repl.from}}:</b></h4>
            <p>{{repl.content}}</p>
            <p class="time">{{moment(repl.timestamp).format('lll')}}</p>
        </div>
    </div>
    </div>
</div>
</template>

<script>
import firebase from 'firebase'
import moment from 'moment'
import db from '@/firebase/init'
export default {
    name:'CommentsPage',
    data(){
        return{
            comment:{
                content:null,
                from:null,
                likes:0,
                to:null,
                img:null,
                timestamp:null,
                id:null
            },
            moment:moment,
            likes:0,
            firebase:firebase,
            likes_by:[],
            liked:false,
            imgLikes:0,
            imgLiked:false,
            imgLikes_by:[],
            updateImgLike:0,
            updateImgLikes_by:[],
            replies:[],
            img_id:null,
            reply:null,
            reply_flag:true,
            comments:[],
            files:[],
            fileName:'',
            imglink:'https://firebasestorage.googleapis.com/v0/b/findmybus-189414.appspot.com/o/images%2F'+this.$route.params.user+'%2F',
            urlparam:'?alt=media',
            feedback:null
        }
    },
    methods:{
        addComment(){
            db.collection('comments').doc().set({
                content:this.comment.content,
                from:firebase.auth().currentUser.displayName,
                to:this.$route.params.user,
                img:this.$route.params.name,
                timestamp:Date.now(),
                reply:[],
                likes:0,
                likes_by:[]
            })
            .then(()=>{
                this.comment.content=null
                this.$forceUpdate()
            })
        },
        updateCommentLike(comment){
            this.$forceUpdate()
            db.collection('comments').doc(comment.id).get()
            .then(doc=>{
                this.likes=doc.data().likes
                this.likes_by=doc.data().likes_by
            })
            this.likes+=1
            this.likes_by.push(firebase.auth().currentUser.displayName)
            db.collection('comments').doc(comment.id).update({
                likes:this.likes,
                likes_by:this.likes_by

            })
            .then(()=>{
                this.liked=true
                this.$forceUpdate()
            })
        },
         updateCommentUnlike(comment){
            db.collection('comments').doc(comment.id).get()
            .then(doc=>{
                this.likes=doc.data().likes
                this.likes_by=doc.data().likes_by
            })
            this.likes-=1
            this.likes_by.pop(firebase.auth().currentUser.displayName)
            db.collection('comments').doc(comment.id).update({
                likes:this.likes,
                likes_by:this.likes_by
            })
            .then(()=>{
                this.liked=false
                this.$forceUpdate()
            })
        },
        getReply(comment){
            let creplies=[]
            db.collection('comments').doc(comment.id).get()
            .then(doc=>{
                creplies=doc.data().reply
                creplies.push({
                from:firebase.auth().currentUser.displayName,
                to:this.$route.params.user,
                timestamp:Date.now(),
                comment:comment.content,
                content:this.reply
            })
            db.collection('comments').doc(comment.id).update({
                reply:creplies
            })
            .then(()=>{
                this.reply=""
                console.log(this)
                this.$forceUpdate()
            })
            })
            
        },
        updateImagelike(){
            db.collection('images').doc(this.img_id).get()
            .then(doc=>{
                this.updateImgLike=doc.data().likes
                this.updateImgLikes_by=doc.data().likes_by
            })
            this.updateImgLike+=1
            this.updateImgLikes_by.push(firebase.auth().currentUser.displayName)
            db.collection('images').doc(this.img_id).update({
                likes:this.updateImgLike,
                likes_by:this.updateImgLikes_by
            })
            .then(()=>{
                this.imgLiked=true
                this.$forceUpdate()
            })
        },
        updateImageUnlike(){
            db.collection('images').doc(this.img_id).get()
            .then(doc=>{
                this.updateImgLike=doc.data().likes
                this.updateImgLikes_by=doc.data().likes_by
            })
            this.updateImgLike-=1
            this.updateImgLikes_by.pop(firebase.auth().currentUser.displayName)
            db.collection('images').doc(this.img_id).update({
                likes:this.updateImgLike,
                likes_by:this.updateImgLikes_by
            })
            .then(()=>{
                this.imgLiked=false
                this.$forceUpdate()
            })
        }
    },
    created(){
        console.log("created")
        db.collection('images')
        .where('image','==',this.$route.params.name)
        .where('owner','==',this.$route.params.user)
        .get()
        .then(snap=>{
            snap.forEach(doc=>{
                this.img_id=doc.id
                this.imgLikes=doc.data().likes
                this.imgLikes_by=doc.data().likes_by
            })
        console.log(this.imgLikes_by)
        if(this.imgLikes_by.includes(firebase.auth().currentUser.displayName)){
            this.imgLiked=true
        }
        })
        db.collection('comments')
        .where('img','==',this.$route.params.name)
        .where('to','==',this.$route.params.user)
        .onSnapshot((snapshot)=>{
            snapshot.docChanges().forEach((change)=>{
                if(change.type=='added'){
                    let doc = change.doc
                    let comment={}
                    comment.content=doc.data().content
                    comment.likes=doc.data().likes
                    comment.likes_by=doc.data().likes_by
                    comment.from=doc.data().from
                    comment.to=doc.data().to
                    comment.img=doc.data().img,
                    comment.timestamp=doc.data().timestamp
                    comment.id=doc.id
                    comment.reply=doc.data().reply
                    this.comments.push(comment)
                }
            })
        })
        console.log(this.comments)
    }
}
</script>

<style>
.time{
    font-size: 0.8em
}
</style>
 