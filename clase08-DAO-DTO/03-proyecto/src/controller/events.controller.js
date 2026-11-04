import { isValidObjectId } from "mongoose"
import { CategoryModel } from "../dao/models/categoryModel.js"
import { EventModel } from "../dao/models/eventModel.js"
import { userModel } from "../dao/models/userModel.js"
import { eventsService } from "../service/index.js"

// export const getEvents = async(req, res) => {
//     // TODO: Acá implemetar la lógica correspondiente



//     // Por el momento respondemos con un ok
//     res.json({ status: 'ok' });
// };

export const getEvents = async (req, res) => {
    try {
        // const events = await EventModel.find(filter).populate('category').populate('organizer', 'first_name last_name email').sort(sort).skip(skip).limit(limitNumber)
        // const totalEvents = await EventModel.countDocuments(filter)
        const events=await eventsService.getEvents(req.query)
        // const totalEvents = await EventModel.countDocuments(req.query)
        const totalEvents = await eventsService.countEvents(req.query)
        res.json({ status: 'success', payload: events, pagination: { total: totalEvents, page: req.query.page, limit: req.query.limit, totalPages: Math.ceil(totalEvents / req.query.limit) } })
    } catch (error) {
        console.log(error)
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`internal server error`})
    }
}

export const getEventById = (req, res) => {
    // TODO: Acá implemetar la lógica correspondiente

    // Por el momento respondemos con un ok
    res.json({ status: 'ok' });
};

export const createEvent = async(req, res) => {
    // TODO: Acá implemetar la lógica correspondiente
    try {
        console.log(req.user)
        let {
            title, 
            description, 
            date,
            capacity, 
            price, 
            category,
            location, 
        }=req.body
    
        if(!title || !description || !category || !location || !date || !capacity){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Complete title description category location date capacity`})
        }
    
        // valido que la category sea un _id valido
        // Tambien podría buscar por descripción, para permitir
        // que lleguen categorias con la descripción "rock", por ej., 
        // como vimos en el get
        // if(!isValidObjectId(category)){
        //     res.setHeader('Content-Type','application/json');
        //     return res.status(400).json({error:`Ingrese un id válido de categoría`})
        // }
    
        // let existe=await CategoryModel.findById(category)
        // if(!existe){
        //     res.setHeader('Content-Type','application/json');
        //     return res.status(400).json({error:`Categoría inválida`})
        // }
    
        let eventDate=new Date(date)
        // console.log(eventDate, typeof eventDate)
        if(isNaN(eventDate.getTime())){
            // estándar ISO 8601.
            // El formato específico más recomendado es: 
            // YYYY-MM-DDTHH:mm:ss.sssZ (por ejemplo: 2026-10-19T21:13:00.000Z)
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Ingrese una fecha válida, formato YYYY-MM-DDTHH:mm:ss.sssZ`})
        }

        let capacityNumber=Number(capacity)
        // reglas de negocio: capacidad no puede ser menor a 1, tiene que ser entera, y numérica
        if(isNaN(capacityNumber) || capacityNumber<1 || !Number.isInteger(capacityNumber)){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`capacity debe ser de timpo numérico, entero, positivo`})
        }
    
        // busco el _id el organizador
        let organizer=await userModel.findOne({email:req.user.email})
        let newEvent=await EventModel.create({
            title, 
            description, 
            date: eventDate,
            capacity, 
            price, 
            category,
            location,         
            organizer: organizer._id})
    
        // Por el momento respondemos con un ok
        res.json({ status: 'ok', newEvent});
    } catch (error) {
        console.log(error)
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`Internal server error`})
    }
};

export const updateEvent = async(req, res) => {
    // TODO: Acá implemetar la lógica correspondiente
    let eid=req.params.eid
    if(!isValidObjectId(eid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ingrese un id válido de Mongodb`})
    }
    let evento=await EventModel.findById(eid)
    if(!evento){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Evento no existe`})
    }
    const permiteModificar=["title", "description", "location", "capacity", "date"]
    const aModificar=Object.keys(req.body)
    if(aModificar.some(p=>!permiteModificar.includes(p))){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Solo puede editar title, description, location, capacity`})        
    }
    
    console.log(evento.date.getTime(), Date.now())
    if(evento.date.getTime()<Date.now()){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`El evento ya ha pasado`})
    }

    let updatedEvent=await EventModel.findByIdAndUpdate(eid, req.body, {new: true})
    // Por el momento respondemos con un ok
    res.json({ status: 'ok', updatedEvent });
};


export const deleteEvent = (req, res) => {
    // TODO: Acá implemetar la lógica correspondiente

    // Por el momento respondemos con un ok
    res.json({ status: 'ok' });
};
