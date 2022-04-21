
import express from 'express';

import * as drive from './drive.js'


const app = express()
const port = 3000

app.use(express.json());
app.use('/', express.static('frontend'))

app.get('/api/drive', (req, res) => {

  drive.getFilesFromDir()
      .then(files => drive.filesToAlpfiles(files))
      .then(alpfiles => res.send(alpfiles))
      .catch(error => {
          res.sendStatus(400, "Le dossier n'existe pas")
      })
   

})


function start() {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

}


export { start }
