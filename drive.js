
import fs from 'fs/promises';

export function getFilesFromDir(path) {
    return fs.readdir(path, { withFileTypes: true })
}

export function filesToAlpfiles(dirents) {

    return dirents.map(dirent => {
        return {
            name: dirent.name,
            isFolder: dirent.isDirectory()
        }
    })
}

export function displayFile(path){
    return fs.readFile(path, (err, data) => {
      return data 
      });

}

export function checkFileOrDirectory (path){

    return fs.stat(path, (err, stats)=> {
        return stats.isDirectory()
      })
}