const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const router = require('./src/router/routes')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(cors())

app.use("/",router)


app.listen(3008, () =>{
    console.log("Servidor rodando!!")
})

