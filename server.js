
import express from 'express';
import fs from 'fs/promises';
import * as drive from './drive.js'


const app = express();
const port = 3000;

app.use(express.json());
app.use('/', express.static('frontend'));

app.get('/api/drive', (req, res) => {

  const path = './data';
  drive.getFilesFromDir(path)
    .then(files => drive.filesToAlpfiles(files))
    .then(alpfiles => res.send(alpfiles))
    .catch(error => {
      res.sendStatus(400, "Le dossier n'existe pas")
    })

});

app.get('/api/drive/:name', (req, res) => {

  const name = req.params.name;
  const path = './data/'+ name;

drive.checkFileOrDirectory(path)
  .then(responseFileOrDirectory => {
    if (responseFileOrDirectory) {
      drive.getFilesFromDir(path)
        .then(files => drive.filesToAlpfiles(files))
        .then(alpfiles => res.send(alpfiles))
    } else {
      drive.displayFile(path)
      .then(file => res.send(file))
    } 
  })
  .catch(error => {
    res.sendStatus(404, "Le dossier ou le fichier n'existe pas")
  })
});


function start() {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

};


export { start }
