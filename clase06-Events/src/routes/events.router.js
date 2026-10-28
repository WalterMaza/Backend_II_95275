import { Router } from 'express';
import { getEvents, getEventById,createEvent, updateEvent, deleteEvent } from '../controller/events.controller.js';
import { authorizeRoles } from '../middleware/authorization.middleware.js';
import passport from 'passport';

export const router = Router();


router.get("/", passport.authenticate("current", { session: false }), authorizeRoles("admin", "organizer", "user"), getEvents)

router.get("/:eid", passport.authenticate("current", { session: false }), authorizeRoles("admin", "organizer", "user"), getEventById)

router.patch("/:eid", passport.authenticate("current", { session: false }), authorizeRoles("admin", "organizer"), updateEvent)

router.post("/", passport.authenticate("current", { session: false }), authorizeRoles("organizer", "admin"), createEvent);

router.delete("/:eid", passport.authenticate("current", { session: false }), authorizeRoles("admin"), deleteEvent)




