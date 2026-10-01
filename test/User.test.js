import Assert from "assert"
import {describe, test, before, beforeEach, after} from "node:test"
import { UserModel } from "../src/models/user.model.js"
import { connectDB } from "../src/config/db.js"
import mongoose from "mongoose"

let userMock={
    first_name: "Mariana", last_name: "Lopez", email: "mariana@test.com", 
    password: "123",
}

const assert=Assert.strict

describe("Test modelo usuarios", async()=>{

    before(async()=>{
        await connectDB()
    })

    after(async()=>{
        await mongoose.disconnect()
    })

    beforeEach(async()=>{
        await UserModel.deleteMany({email: userMock.email })
    })

    test("El modelo permite grabar usuarios en DB", async()=>{
        let user=await UserModel.create(userMock)

        user=user.toJSON()

        assert.strictEqual(Object.keys(user).includes("_id"), true)
        assert.strictEqual(Object.keys(user).includes("updatedAt"), true)
    })

    test("El mail siempre se graba en minuscula", async()=>{
        let user=await UserModel.create({...userMock, email: "MariANa@TesT.COM"})

        user=user.toJSON()

        assert.strictEqual(userMock.email, user.email)
    })
    
    test("No permite grabar usurios sin nombre", async()=>{
        await assert.rejects(
            async()=>{
                await UserModel.create({...userMock, first_name: undefined})
            }, 
            "Si llega un usuario sin first_name, debe lanzar un error"
        )
    })


})