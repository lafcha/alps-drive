
import express from 'express';
import { cp } from 'fs';
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
    .then(alpfiles => res.status(200).send(alpfiles))
    .catch(error => {
      res.sendStatus(400, "Le dossier n'existe pas")
    })

});

app.get('/api/drive/:name', (req, res) => {

  const name = req.params.name;
  const path = './data/' + name;

  drive.checkFileOrDirectory(path)
    .then(responseFileOrDirectory => {
      if (responseFileOrDirectory) {
        drive.getFilesFromDir(path)
          .then(files => drive.filesToAlpfiles(files))
          .then(alpfiles => res.status(200).send(alpfiles))
      } else {
        drive.displayFile(path)
          .then(file => res.status(200).send(file))
      }
    })
    .catch(error => {
      res.sendStatus(404, "Le dossier ou le fichier n'existe pas")
    })
});


app.post('/api/drive', (req, res) => {

  const folderName = req.query.name;
  const path = './data/';

  const regex = new RegExp("^[a-zA-Z0-9]*$");

  let regexMatch = regex.test(folderName);

  if (regexMatch) {
    drive.createNeWDirectory(path, folderName)
      .then(()=>res.status(201).redirect('back'))
      .catch(()=>res.status(400).send('Le dossier existe déjà'))

  } else {
      res.status(400).send("Le format du nom du fichier non valide")
  }







})

function start() {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

};


export { start }
