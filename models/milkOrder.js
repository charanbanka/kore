import mongoose from "mongoose";
import moment from 'moment-timezone'

const dateThailand = moment.tz(Date.now(), "Asia/Bangkok");

const milkOrder = mongoose.Schema({
    customerName: String,
    orderStatus:{type:String,required:true},
    milkQuantity:{type:Number,required:true},
    dispatchDate:Date,
    dispatchAddress:{type:String,required:true},
    dispatchPincode:{type:Number,required:true},
    dispatchCountry:{type:String,required:true},
    subTotal:{type:Number,required:true},
    createdAt: {type: Date, default: dateThailand},
    updatedAt: {type: Date, default: dateThailand}
},{
    timestamps: true
})

export default mongoose.model('MilkOrder',milkOrder)