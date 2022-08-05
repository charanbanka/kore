import express from 'express'
import { checkCapacity, deleteOrder, getOrders, postOrder, updateOrder, updateOrderStatus } from '../controllers/milkController.js'

const router = express.Router()

router.get('/',getOrders)
router.post('/add',postOrder)
router.put('/update/:id',updateOrder)
router.put('/updateStatus/:id',updateOrderStatus)
router.delete('/delete/:id',deleteOrder)
router.get('/checkCapacity/:date',checkCapacity)

export default router