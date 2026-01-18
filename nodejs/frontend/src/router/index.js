import { createRouter, createWebHistory } from 'vue-router';

import Login from '@/views/Login.vue';
import Signup from '@/views/Signup.vue';

import Home from '@/views/Home.vue';
import Results from '@/views/Results.vue';
import Buy from '@/views/Buy.vue';
import Profile from '@/views/Profile.vue';
import MyTrip from '@/views/MyTrip.vue';
import Reservations from '@/views/Reservations.vue';
import OnBoard from '@/views/OnBoard.vue';

import UserManagement from '@/views/admin/UserManagement.vue';
import ReservationManagement from '@/views/admin/ReservationManagement.vue';
import TrainManagement from '@/views/admin/TrainManagement.vue';
import AdminOnBoard from '@/views/admin/AdminOnBoard.vue';

import { isTokenValid } from "../api/auth.js";

const routes = [
    { path: '/', redirect: '/home' },
    {
        path: '/login',
        name: "Login",
        component: Login,
        meta: { requiresAuth: false, requiresAdmin: false, showSidebar: false }
    },
    {
        path: '/signup',
        name: "Signup",
        component: Signup,
        meta: { requiresAuth: false, requiresAdmin: false, showSidebar: false }
    },
    {
        path: '/home',
        name: "Home",
        component: Home,
        meta: { requiresAuth: true, requiresAdmin: false, showSidebar: true, activeMenu: 'home' }
    },
    {
        path: '/results',
        name: "Results",
        component: Results,
        meta: { requiresAuth: true, requiresAdmin: false, showSidebar: true, activeMenu: 'home' }
    },
    {
        path: '/buy/:solutionId',
        name: "Buy",
        component: Buy,
        meta: { requiresAuth: true, requiresAdmin: false, showSidebar: true, activeMenu: 'home' }
    },
    {
        path: '/profile',
        name: "Profile",
        component: Profile,
        meta: { requiresAuth: true, requiresAdmin: false, showSidebar: true, activeMenu: 'profile' }
    },
    {
        path: '/my-trip',
        name: "My Trip",
        component: MyTrip,
        meta: { requiresAuth: true, requiresAdmin: false, showSidebar: true, activeMenu: 'my-trip' }
    },
    {
        path: '/reservations',
        name: "Reservations",
        component: Reservations,
        meta: { requiresAuth: true, requiresAdmin: false, showSidebar: true, activeMenu: 'reservations' }
    },
    {
        path: '/on-board/:trainCode',
        name: "OnBoard",
        component: OnBoard,
        meta: { requiresAuth: false, requiresAdmin: false, showSidebar: false}
    },
    {
        path: '/admin/user-management',
        name: "UserManagement",
        component: UserManagement,
        meta: { requiresAuth: true, requiresAdmin: true, showSidebar: true, activeMenu: 'user-management' }
    },
    {
        path: '/admin/user-management/:user_id',
        name: "UserReservations",
        component: ReservationManagement,
        meta: { requiresAuth: true, requiresAdmin: true, showSidebar: true, activeMenu: 'user-management' }
    },
    {
        path: '/admin/train-management',
        name: "TrainManagement",
        component: TrainManagement,
        meta: { requiresAuth: true, requiresAdmin: true, showSidebar: true, activeMenu: 'train-management' }
    },
    {
        path: '/admin/on-board/:trainCode',
        name: "AdminOnBoard",
        component: AdminOnBoard,
        meta: { requiresAuth: true, requiresAdmin: true, showSidebar: false}
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async(to, from, next) => {
    const authToken = localStorage.getItem('authToken');
    const id = localStorage.getItem('id');
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    let isAuthenticated = false;
    if (authToken && id) {
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
    } else if (to.meta.requiresAdmin && !isAdmin) {
        next('/home');
    } else if (isAuthenticated && (to.path === '/login' || to.path === '/signup')) {
        next('/home');
    } else {
        next();
    }
});

export default router;