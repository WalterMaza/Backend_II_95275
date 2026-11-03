import { Router } from 'express';
import passport from 'passport';

import { getTickets, getTicketById, createTicket, cancelTicket } from '../controller/tickets.controller.js';
import { authorizeRoles } from '../middleware/authorization.middleware.js';

export const router = Router();

// Endpoint para obtener todos los tickets
router.get("/", passport.authenticate("current", { session: false }), authorizeRoles("admin", "organizer", "user"), getTickets)

// Endpoint para obtener un ticket por su id
router.get("/:tid", passport.authenticate("current", { session: false }), authorizeRoles("admin", "organizer", "user"), getTicketById)

// Endpoint para crear un ticket
router.post("/", passport.authenticate("current", { session: false }), authorizeRoles("admin", "organizer", "user"), createTicket)

// Endpoint para cancelar un ticket
router.patch("/:tid/cancel", passport.authenticate("current", { session: false }), authorizeRoles("admin", "organizer", "user"), cancelTicket)