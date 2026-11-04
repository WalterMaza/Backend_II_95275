import { EventModel } from "./models/eventModel.js";


export class EventsDAO{

    async findAll(filter, sort, skip, limitNumber){
        console.log(filter)
        return await EventModel.find(filter).populate('category').populate('organizer', 'first_name last_name email').sort(sort).skip(skip).limit(limitNumber)
    }

    // resto de los metodos
    // findOne
    // create, update, delete, count

    async count(filter){
        return await EventModel.countDocuments(filter)
    }

}