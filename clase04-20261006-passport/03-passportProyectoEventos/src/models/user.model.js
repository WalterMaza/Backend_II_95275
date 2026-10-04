import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        first_name:{
            type:String, 
            required: true, 
            trim: true, 
            minLenght: 2,
            validate: {
                validator:data=>{
                    return (/[0-9]/).test(data)?false:true
                }, 
                message:data=>`El nombre no puede contener números`
            }
        },
        last_name:{
            type:String, 
            required: true, 
            trim: true,             
        },
        email: {
            type: String, 
            lowercase: true, 
            trim: true, 
            required: true, 
            unique: true, 
        },
        password: {
            type: String, 
            required: true, 
        }, 
        role: {
            type: String, 
            enum: ["user", "admin", "manager"], 
            default: "user"
        },
    }, 
    {
        timestamps: true, 
        // strict: false, 
        // collection: "usuariosEmpresaTal2021",
    }
);

export const UserModel = mongoose.model('User', userSchema);
