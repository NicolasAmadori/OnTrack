import { createRouter, createWebHistory } from 'vue-router';

import Login from '@/views/Login.vue';
import Signup from '@/views/Signup.vue';

import Home from '@/views/Home.vue';
import Results from '@/views/Results.vue';
import Profile from '@/views/Profile.vue';
import MyTrip from '@/views/MyTrip.vue';
import Reservations from '../views/Reservations.vue';

import UserManagement from '@/views/admin/UserManagement.vue';
import ReservationManagement from '@/views/admin/ReservationManagement.vue';

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
        meta: { requiresAuth: true, showSidebar: true, activeMenu: 'home' }
    },
    {
        path: '/results',
        name: "Results",
        component: Results,
        meta: { requiresAuth: true, showSidebar: true, activeMenu: 'home' }
    },
    {
        path: '/profile',
        name: "Profile",
        component: Profile,
        meta: { requiresAuth: true, showSidebar: true, activeMenu: 'profile' }
    },
    {
        path: '/my-trip',
        name: "My Trip",
        component: MyTrip,
        meta: { requiresAuth: true, showSidebar: true, activeMenu: 'my-trip' }
    },
    {
        path: '/reservations',
        name: "Reservations",
        component: Reservations,
        meta: { requiresAuth: true, showSidebar: true, activeMenu: 'reservations' }
    },
    {
        path: '/admin/user-management',
        name: "UserManagement",
        component: UserManagement,
        meta: { requiresAuth: true, showSidebar: true, activeMenu: 'user-management' }
    },
    {
        path: '/admin/user-management/:user_id',
        name: "UserReservations",
        component: ReservationManagement,
        meta: { requiresAuth: true, showSidebar: true, activeMenu: 'user-management' }
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