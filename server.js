
import express from 'express'

const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

function start() {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
    app.use('/static', express.static('frontend'))

}


export { start }
