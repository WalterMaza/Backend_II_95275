import { Router } from 'express';
import { login, logout, registro } from '../controller/sessions.controller.js';
import passport from 'passport';
export const router = Router()

// router.post('/register', registro)
router.post(
    '/register',
    // paso 3
    passport.authenticate("register", { session: false }),
    registro
)

// app.get('/protected', function (req, res, next) {
//     passport.authenticate('local', function (err, user, info, status) {
//         if (err) { return next(err) }
//         if (!user) { return res.redirect('/signin') }
//         res.redirect('/account');
//     })(req, res, next);
// });

// (req, res, next)=>{}


router.post(
    '/login', 
    passport.authenticate("login", {session: false}), 
    login
)

router.get("/logout", logout)

