import Vue from 'vue'
import Router from 'vue-router'
import IndexPage from '@/components/IndexPage'
import UserProfile from '@/components/UserProfile'
import CommentsPage from '@/components/CommentsPage'
import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'IndexPage',
      component: IndexPage
    },
    {
      path: '/userprofile',
      name: 'UserProfile',
      component: UserProfile,
      meta:{
        requiresAuth:true
      }
    },
    {
      path: '/commentspage',
      name: 'CommentsPage',
      component: CommentsPage,
      meta:{
        requiresAuth:true,
        img:true
      }
    }
  ]
})

router.beforeEach((to,from,next)=>{
  if(to.matched.some(rec=> rec.meta.requiresAuth && rec.meta.img)){
    let user = firebase.auth().currentUser
    if(user && to.params.name){
      next()
    }
    else{
    next({name:'UserProfile'})
    }
  }
  else if(to.matched.some(rec => rec.meta.requiresAuth)){
    let user = firebase.auth().currentUser
    if(user){
      next()
    }
    else{
      next({name:'IndexPage'})
      toastr.error('please sign in first')
    }
  }
  else{
    next()
  }
})

export default router
