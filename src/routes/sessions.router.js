import { Router } from 'express';
import {  login, registro, logout, current,  } from '../controller/sessions.controller.js';
import passport from 'passport';
export const router = Router()

// router.post('/register', registro)
router.post(
    '/register',
    // paso 3
    passport.authenticate("register", { session: false }),
    registro
)

// router.post('/login', login)
router.post(
    '/login', 
    passport.authenticate("login", {session: false}), 
    login
)

router.get("/current", passport.authenticate("current", {session: false}), current)


router.post("/logout", logout)



