import { isValidObjectId } from "mongoose"
import { generateError } from "../utils.js"

export class EventsService{
    #eventsRepository
    #categoryRepository

    /**
     * 
     * @param {import("../repository/EventRepository.js").EventRepository} eventsRepository 
     * @param {import("../repository/CategoryRepository.js").CategoryRepository} categoryRepository 
     */
    constructor(eventsRepository, categoryRepository){
        this.#eventsRepository=eventsRepository
        this.#categoryRepository=categoryRepository
    }

    async #createFilter({ category, status, location, fromDate, toDate, search}){
        const filter = {}
        if (category) {
            if(isValidObjectId(category)){
                filter.category = category 
            }else{
                console.log(category)
                // let cat01=await CategoryModel.findOne({category})
                let cat01=await this.#categoryRepository.getCategoryBy({category})
                if(!cat01){
                    // res.setHeader('Content-Type','application/json');
                    // return res.status(400).json({error:`Categoria invalida`})
                    throw generateError(`Categoria invalida`, "Events Service", 400)
                }
                filter.category = cat01._id 
            }
        }
        if (status) { filter.status = status }
        if (location) { filter.location = { $regex: location, $options: 'i' } }
        if (fromDate || toDate) {
            filter.date = {}
            let from=new Date(fromDate)
            let to=new Date(toDate)
            console.log(from)
            console.log(to)
            if(isNaN(from.getTime()) || isNaN(to.getTime())){
                // res.setHeader('Content-Type','application/json');
                // return res.status(400).json({error:`Fechas incorrectas`})
                throw generateError(`Fechas incorrectas`, "Events Service", 400)
            }
            if (fromDate) { filter.date.$gte = new Date(fromDate) }
            if (toDate) { filter.date.$lte = new Date(toDate) }
        }
        if (search) { filter.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }] }

        return filter
    }

    async getEvents({page, limit, sort, ...data}){
        console.log(data)
        const filter=await this.#createFilter(data)
        console.log(filter, "filtro")
        
        const pageNumber = Number(page)  
        const limitNumber = Number(limit)  
        const skip = (pageNumber - 1) * limitNumber

        return await this.#eventsRepository.getEvents(filter, sort, skip, limitNumber)
    
    }

    async countEvents(data){
        const filter=await this.#createFilter(data)

        console.log("filter count", filter)

        return await this.#eventsRepository.countEvents(filter)
    }
}