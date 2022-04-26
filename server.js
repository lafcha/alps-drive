
import express from 'express';
import { cp } from 'fs';
import fs from 'fs/promises';
import * as drive from './drive.js';
import fu from 'express-fileupload';
import { Buffer } from 'buffer';



const app = express();
const port = 3000;

app.use(express.json());
app.use('/', express.static('frontend'));
app.use(fu({
  createParentPath: true,
}));


/*** DISPLAY FILES & FOLDERS ***/
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


/*** CREATE FILES & FOLDERS ***/
app.post('/api/drive', (req, res) => {

  const folderName = req.query.name;
  const path = './data/';

  let regexMatch = drive.regexTest(folderName);

  if (regexMatch) {
    drive.createNeWDirectory(path, folderName)
      .then(() => res.status(201).redirect('back'))
      .catch(() => res.status(400).send('Le dossier existe déjà'))

  } else {
    res.status(400).send("Le format du nom du fichier non valide")
  }
});

app.post("/api/drive/:folder", async (req, res) => {

  const parentFolder = req.params.folder;
  const newFolder = req.query.name;
  const path = './data/';
  const newFolderPath = path + parentFolder + '/';

  let regexTest = drive.regexTest(newFolder);

  let result = await fs.stat(path + parentFolder);

  if (result.isDirectory()) {
    if (regexTest) {
      drive.createNeWDirectory(newFolderPath, newFolder)
        .then(() => res.status(201).redirect('back'))
        .catch(() => res.status(400).send('Le dossier existe déjà'))

    } else {
      res.status(400).send("Le format du nom du fichier non valide")
    }

  } else {
    res.status(404).send("Le dossier parent n'existe pas")
  }
});

/*** DELETE FILES & FOLDERS ***/
app.delete("/api/drive/:name", async (req, res) => {
  const name = req.params.name;
  const path = "./data/";

  let result = await fs.stat(path + name);
  let regexMatch;

  if (result.isDirectory()) {
    regexMatch = drive.regexTest(name);
  }
  if (!result.isDirectory() || regexMatch) {
    drive.deleteFileOrDirectory(path + name)
      .then(() => res.status(200).send('Deleted'))
      .catch(() => res.status(400).send('File or directory could not be deleted'))
  } else {
    res.status(400).send("Le format du nom du fichier non valide")
  }

});


app.delete("/api/drive/:folder/:name", async (req, res) => {
  const name = req.params.name;
  const folder = req.params.folder;
  const path = "./data/";

  let result = await fs.stat(path + folder + "/" + name);
  let regexMatch;

  if (result.isDirectory()) {
    regexMatch = drive.regexTest(name);
  }
  if (!result.isDirectory() || regexMatch) {
    drive.deleteFileOrDirectory(path + folder + "/" + name)
      .then(() => res.status(200).send('Deleted'))
      .catch(() => res.status(400).send('File or directory could not be deleted'))
  } else {
    res.status(400).send("Le format du nom du fichier non valide")
  }
})

/*** UPLOAD FILES ***/
app.put("/api/drive/", (req, res) => {

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  };

  let file = req.files.file;
  let uploadedPath = "./data/" + file.name;

  file.mv(uploadedPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(201);
  });
  const path = './data/';
  drive.getFilesFromDir(path)
    .then(files => drive.filesToAlpfiles(files))
    .then(alpfiles => res.status(200).send(alpfiles))

});

app.put("/api/drive/:folder", (req, res) => {

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  };


  let folder = req.params.folder;
  let file = req.files.file;
  let uploadedPath = "./data/" + folder + '/'+ file.name;

  file.mv(uploadedPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(201);
  });

  const path = './data/';
  drive.getFilesFromDir(path)
    .then(files => drive.filesToAlpfiles(files))
    .then(alpfiles => res.status(200).send(alpfiles))

});

function start() {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

};


export { start }
