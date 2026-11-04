
export class EventRepository{
    #eventsDAO

    /**
     * 
     * @param {import("../dao/EventsDAO.js").EventsDAO} eventsDAO 
     */
    constructor(eventsDAO){
        this.#eventsDAO=eventsDAO
    }

    async getEvents(filter, sort, skip, limitNumber){
        return await this.#eventsDAO.findAll(filter, sort, skip, limitNumber)
    }

    async countEvents(filter){
        return await this.#eventsDAO.count(filter)
    }
}


// app -> router -> controller -> service -> repo -> dao