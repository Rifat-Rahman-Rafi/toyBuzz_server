

const express = require('express')
const cors = require('cors')
require('dotenv').config();
const app = express()
const port = process.env.PORT || 8000;

// middleware
app.use(cors());
app.use(express.json());





app.get('/', (req, res) => {
    res.send('Test port Running')
})

app.listen(port, () => {
    console.log(`Server is Running  ${port}`)
})