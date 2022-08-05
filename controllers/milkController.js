import mongoose from "mongoose"
import milkOrder from "../models/milkOrder.js"
import dotenv from 'dotenv'
import e from "express"
dotenv.config()


export const getOrders = async(req,res) =>{
    try {
        const orders = await milkOrder.find()

        res.status(200).json(orders)

    } catch (error) {
        res.status(404).json(error)
    }
}



export const postOrder = async(req,res) =>{
    var date_ = new Date()
    var day = date_.getUTCDate()
    if(day<10)
    day = ("0" + date_.getUTCDate()).slice(-2);
    var month = date_.getUTCMonth()
    if(month<10)
        month = ("0" + (date_.getUTCMonth() + 1)).slice(-2);

    var date = date_.getUTCFullYear()+"-"+(month)+"-"+(day) ;
    if(month==12 && day ==31){
        date = date_.getUTCFullYear()+1+"-01-01"
    }
    date = new Date(date)
    const new_date = new Date(date)
    new_date.setUTCDate(new_date.getUTCDate()+1)
    try {
        const orders = await milkOrder.find({createdAt: {$gt: new Date(date),$lt: new Date(new_date)}})
        let total =0
        orders.map((order)=>total+=parseInt(order.milkQuantity))
        if(total>=10) return res.status(200).send('Milk is empty. Please order next day! and we are maintaining daily 10 litrs quantity only')
        const data = req.body
        const count = parseInt(total)+parseInt(data.milkQuantity)
        if(count>10) return res.status(200).send(`Milk available Quantity is ${10-total}! Please order based on quantity remaining.`)
    
        const order = new milkOrder({...req.body,orderStatus:"placed"})

        const newOrder = await order.save()
        res.status(200).json(newOrder)
    } catch (error) {
        res.status(409).json(error)
    }
}

export const updateOrder = async(req,res) =>{
    const {id} = req.params
    const order = req.body
    var date_ = new Date()
    var day = date_.getUTCDate()
    if(day<10)
        day = ("0" + date_.getUTCDate()).slice(-2);
    var month = date_.getUTCMonth()
    if(month<10)
        month = ("0" + (date_.getUTCMonth() + 1)).slice(-2);

    var date = date_.getUTCFullYear()+"-"+(month)+"-"+(day) ;
    if(month==12 && day ==31){
        date = date_.getUTCFullYear()+1+"-01-01"
    }
    date = new Date(date)
    const new_date = new Date(date)
    new_date.setUTCDate(new_date.getUTCDate()+1)
    try {
        const orders = await milkOrder.find({createdAt: {$gt: new Date(date),$lt: new Date(new_date)}})
        let total =0
        orders.map((order)=>total+=parseInt(order.milkQuantity))
        const oldOrder = await milkOrder.findById(id)
        const count = parseInt(total)+parseInt(order.milkQuantity)-parseInt(oldOrder.milkQuantity)
        if(count>10) return res.status(200).send(`Milk available Quantity is ${10-total}! Please order based on quantity remaining.`)

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No order with id: ${id}`);
        const updatedOrder = await milkOrder.findByIdAndUpdate(id,order,{new:true})

        res.status(200).json(updatedOrder)
        
    } catch (error) {
        res.status(409).json(error)
    }
}

export const updateOrderStatus = async(req,res) =>{
    const {id} = req.params
    const {orderStatus} = req.body
    const arr =['placed','dispatched','packed','delivered']

    try {
        if(!arr.includes(orderStatus)) return res.status(200).send("orderStatus should be one of the list of item - ['placed','packed','dispatched','delivered']")
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No order with id: ${id}`);

        const order = await milkOrder.findById(id)
        order.orderStatus = orderStatus
        if(orderStatus == "dispatched")
            order.dispatchDate = new Date()
        const updatedStatusOrder = await order.save()

        res.status(200).json(updatedStatusOrder)
    } catch (error) {
        res.status(404).json(error)
    }
}

export const deleteOrder = async(req,res) =>{
    const { id } = req.params
    try {
        await milkOrder.findByIdAndDelete(id)

        res.status(200).json(`Order deleted successfully!`)
    } catch (error) {
        res.status(404).json(error)
    }
}

export const checkCapacity = async(req,res) =>{
    const {date} = req.params
    const date_ = new Date(date)
    if(date_.getMonth()==12 && date_.getDate()==31){
        date_ = date_.getFullYear()+1+"-01-01"
    }
    const new_date = new Date(date_)
    new_date.setDate(new_date.getDate()+1)
    try {
        const orders = await milkOrder.find({createdAt: {$gt: new Date(date_),$lt: new Date(new_date)}})
        let total =0
        orders.map((order)=>total+=parseInt(order.milkQuantity))

        res.status(200).send(`Available Capacity is ${10-total} for this Date: ${date}! And max capacity per day is 10`)
    } catch (error) {
        res.status(404).json(error)
    }
}