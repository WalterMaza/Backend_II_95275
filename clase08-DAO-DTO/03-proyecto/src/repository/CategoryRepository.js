

export class CategoryRepository{
    #categoryDAO

    /**
     * 
     * @param {import("../dao/CategoryDAO.js").CategoryDAO} categoryDAO 
     */
    constructor(categoryDAO){
        this.#categoryDAO=categoryDAO
    }

    async getCategoryBy(filtro){
        return this.#categoryDAO.findOne(filtro)
    }
}