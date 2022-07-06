const express = require('express');
const uuid = require('uuid')

const port = 4000
const app = express()
app.use(express.json())

const order = []

const checkUserId = (request, response, next) =>{
    const { id } = request.params

    const index = order.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "User not found"})
    }

    request.userIndex = index
    request.userId = id

    next()
}

const method = (request, response, next) => {
    console.log(`O método utilizado foi: ${request.method} a URL: /order`)
    next()

}

app.post('/order', method, (request, response) => {

    const {custumOrder, clientName, price } = request.body
    const clientOrder= {id: uuid.v4(), custumOrder, clientName, price, status: 'Em Preparação'}
    order.push(clientOrder)
    return response.status(201).json(clientOrder)
})

app.get('/order', method, (request, response) => {
    return response.status(201).json(order)
})

app.put('/order/:id', checkUserId, method,(request, response) => {
    const {custumOrder, clientName, price} = request.body
    const index = request.userIndex
    const id = request.userId

    const updateOrder = {id, custumOrder, clientName, price, status:"Em Preparação"}
    order[index] = updateOrder
    return response.json(updateOrder)
})

app.delete('/order/:id', method, checkUserId, (request, response) => {

    const {updateOrder, clientName, value} = request.body
    const index = request.userIndex
    order.splice(index, 1)
    return response.status(204).json()
})

app.get('/order/:id', method, checkUserId,(request, response) => {
   const index = request.userIndex
   const id = request.userId
   const checkOrder = order[index]
    
    return response.json(checkOrder)
 })

 app.patch('/order/:id', checkUserId, method, (request, response) => {
    
    const index = request.userIndex
    const {custumOrder, clientName, price } = order[index]
    const id = request.userId
    const finalstatus = {id, custumOrder, clientName, price, status: "Pedido Finalizado" }

    order[index] = finalstatus

    return response.json(finalstatus)
    
})





app.listen(port, () =>{
    console.log(`🐥 Server Started on port ${port}`)
})