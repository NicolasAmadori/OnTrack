import { createRouter, createWebHistory } from 'vue-router';

import Login from '@/views/Login.vue';
import Home from '@/views/Home.vue';
import Signup from '@/views/Signup.vue';
import Profile from '@/views/Profile.vue';
import UserManagement from '@/views/admin/UserManagement.vue';
import { isTokenValid } from "../api/auth.js";

const routes = [
    { path: '/', redirect: '/home' },
    {
        path: '/login',
        name: "Login",
        component: Login,
        meta: { requiresAuth: false, showSidebar: false }
    },
    {
        path: '/signup',
        name: "Signup",
        component: Signup,
        meta: { requiresAuth: false, showSidebar: false }
    },
    {
        path: '/home',
        name: "Home",
        component: Home,
        meta: { requiresAuth: true, showSidebar: true }
    },
    {
        path: '/profile',
        name: "Profile",
        component: Profile,
        meta: { requiresAuth: true, showSidebar: true }
    },
    {
        path: '/admin/user-management',
        name: "UserManagement",
        component: UserManagement,
        meta: { requiresAuth: true, showSidebar: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async(to, from, next) => {
    const authToken = localStorage.getItem('authToken');
    const id = localStorage.getItem('id');
    const is_admin = localStorage.getItem('is_admin');
    const isTokenAvailable = !!authToken && !!id && !!is_admin;
    let isAuthenticated = false;
    if (isTokenAvailable) {
        try {
            isAuthenticated = await isTokenValid(authToken);
        } catch (error) {
            console.error('Token validation error:', error);
            isAuthenticated = false;
        }
    }

    if (to.meta.requiresAuth && !isAuthenticated) {
        localStorage.clear();
        next('/login');
    } else if (isAuthenticated && (to.path === '/login' || to.path === '/signup')) {
        next('/home');
    } else {
        next();
    }
});

export default router;