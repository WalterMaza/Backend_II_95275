export class ProductsDTO{
    constructor(product){
        this.producto=product.title.toUpperCase()
        this.precio=`$ ${product.price.toFixed(2)}`
        this.marca="Marca ABC"
    }
}

// let n=10
// n.toFixed(2)

// {
//     "_id": "6aea6746fd9ebd63a9d51460",
//     "title": "pelota fútbol 1",
//     "price": 30,
//     "createdAt": "2026-11-03T22:59:18.480Z",
//     "updatedAt": "2026-11-03T22:59:18.480Z",
//     "__v": 0
// },