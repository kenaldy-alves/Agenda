const express = require('express') 
const app = express()

app.get('/', (req, res) => {
    res.status(200).send('Meu Backend!!! iniciado' )
})

app.listen(3000, () =>{
    console.log('BackEnd')
})