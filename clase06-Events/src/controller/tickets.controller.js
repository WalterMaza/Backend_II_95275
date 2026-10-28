import { EventModel } from "../dao/models/eventModel.js"
import { TicketModel } from "../dao/models/ticketModel.js"
import { generateTicketCode } from "../utils/ticketCode.js"

export const createTicket = async (req, res) => {
    try {
    
        const {eventId, quantity } = req.body

        //validar que el evento exista
        const event = await EventModel.findById(eventId)

        if (!event) {
            return res.status(404).json({ status: "error", message: "Evento no encontrado" })
        }

        //validar que el evento esté publicado
        if (event.status !== "published") {
            return res.status(400).json({ status: "error", message: "El evento no está publicado" })
        }

        //validar que el evento no haya pasado
        if(event.date <= new Date()) {
            return res.status(400).json({ status: "error", message: "El evento ya pasó" })
        }
        
        //validar que el usuario no tenga un ticket para este mismo evento
        const existingTicket = await TicketModel.findOne({
            user: req.user._id,
            event: eventId,
            status: "confirmed"
        })

        if (existingTicket) {
            return res.status(400).json({ status: "error", message: "El usuario ya tiene un ticket para este evento" })
        }

        //validar que haya suficientes lugares disponible
        const result = await TicketModel.aggregate([
            {
                $match: {
                    event: eventId,
                    status: "confirmed"
                }
            },
            {
                $group: {
                    _id: "$event",
                    total: { $sum: "$quantity" }
                }
            }
        ])

        const reserved = result[0]?.total || 0

        const available = event.capacity - reserved

        if(available < quantity) {
            return res.status(400).json({ status: "error", message: "No hay suficientes lugares disponibles" })
        }

        console.log("REQ.USER", req.user)
        const ticket = await TicketModel.create({
            user: req.user._id,
            event: eventId,
            quantity: quantity,
            reservationCode: generateTicketCode()
        })

        res.status(201).json({
            status: "success", 
            payload: ticket
        })

    } catch (error) {
        res.status(500).json({ status: "error", message: error.message })
    }
}

export const getTickets = async (req, res) => {
    try {
        // Obtener los parámetros de la query
        const { status, eventId, page = 1, limit = 10, sort = 'createdAt' } = req.query
        const filter = {}

        // Filtrar por status si se proporciona
        if (status) { filter.status = status }
        
        // Filtrar por eventId si se proporciona
        if (eventId) { filter.event = eventId }

        // Convertir page y limit a números, ya que vienen como strings en la query
        const pageNumber = Number(page)
        const limitNumber = Number(limit)
        const skip = (pageNumber - 1) * limitNumber

        // Buscar los tickets con los filtros aplicados, populando user y event, ordenando por sort
        // También paginando con skip y limit para no devolver todos los tickets en una sola respuesta
        const tickets = await TicketModel.find(filter)
            .populate('user', 'first_name last_name email')
            .populate('event', 'title date location')
            .sort(sort)
            .skip(skip)
            .limit(limitNumber)


        // Contar el total de tickets que cumplen con los filtros con countDocuments()
        // que es un método de Mongoose que cuenta el número de documentos que cumplen con los filtros
        const totalTickets = await TicketModel.countDocuments(filter)

        // Devolver la respuesta con los tickets y la paginación
        res.json({
            status: 'success',
            payload: tickets,
            pagination: {
                total: totalTickets,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(totalTickets / limitNumber)
            }
        })
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message })
    }
}

export const getTicketById = async (req, res) => {
    try {
        const { tid } = req.params

        // Acá buscamos el ticket por su ID y populamos los campos user y event
        const ticket = await TicketModel.findById(tid)
            .populate('user', 'first_name last_name email')
            .populate('event', 'title date location capacity price')

        if (!ticket) {
            return res.status(404).json({ status: "error", message: "Ticket no encontrado" })
        }

        // Devolvemos la respuesta con el ticket encontrado
        res.json({ status: "success", payload: ticket })
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message })
    }
}

export const cancelTicket = async (req, res) => {
    try {
        // Extraer el ID del ticket de los parámetros de la ruta
        const { tid } = req.params

        const ticket = await TicketModel.findById(tid)

        if (!ticket) {
            return res.status(404).json({ status: "error", message: "Ticket no encontrado" })
        }

        if (ticket.status === "cancelled") {
            return res.status(400).json({ status: "error", message: "El ticket ya está cancelado" })
        }

        const event = await EventModel.findById(ticket.event)

        if (!event) {
            return res.status(404).json({ status: "error", message: "Evento no encontrado" })
        }

        if (event.date <= new Date()) {
            return res.status(400).json({ status: "error", message: "No se puede cancelar un ticket de un evento que ya pasó" })
        }

        // Actualizamos el estado del ticket a cancelado
        ticket.status = "cancelled"

        // Registramos la fecha de cancelación
        ticket.canccelledAt = new Date()

        // Guardamos los cambios aplicados al ticket en la base de datos
        await ticket.save()

        res.json({ status: "success", payload: ticket })
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message })
    }
}