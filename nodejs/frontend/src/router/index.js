import { createRouter, createWebHistory } from 'vue-router';

import Login from '@/views/Login.vue';
import Home from '@/views/Home.vue';
import Signup from '@/views/Signup.vue';
import Profile from '@/views/Profile.vue';

const routes = [
    { path: '/', redirect: '/home' },
    { path: '/login', name: "Login", component: Login },
    { path: '/signup', name: "Signup", component: Signup },
    { path: '/home', name: "Home", component: Home },
    { path: '/profile', name: "Profile", component: Profile},
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;