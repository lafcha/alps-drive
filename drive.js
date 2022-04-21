
import fs from 'fs/promises';

export function getFilesFromDir() {
    return fs.readdir('./data', { withFileTypes: true })
  }
  
export function filesToAlpfiles(dirents) {
  
    return dirents.map(dirent => {
        return {
            name: dirent.name,
            isFolder: dirent.isDirectory()
        }
    })
  }