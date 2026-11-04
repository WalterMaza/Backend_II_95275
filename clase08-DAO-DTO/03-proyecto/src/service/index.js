import { CategoryDAO } from "../dao/CategoryDAO.js"
import { EventsDAO } from "../dao/EventsDAO.js"
import { CategoryRepository } from "../repository/CategoryRepository.js"
import { EventRepository } from "../repository/EventRepository.js"
import { EventsService } from "./EventsService.js"

const eventsDAO=new EventsDAO()
const categoryDAO=new CategoryDAO()

const eventsRepository=new EventRepository(eventsDAO)
const categoryRepository=new CategoryRepository(categoryDAO)

export const eventsService = new EventsService(eventsRepository, categoryRepository)