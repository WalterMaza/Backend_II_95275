import mongoose from "mongoose"

const ticketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    status: {
        type: String,
        enum: ["confirmed", "pending", "cancelled"],
        default: "confirmed"
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    reservationCode: {
        type: String,
        required: false,
        unique: true
    },
    canccelledAt: {
        type: Date,
        default: null
    }
})

export const TicketModel = mongoose.model("Ticket", ticketSchema)
