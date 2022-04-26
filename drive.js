
import fs from 'fs/promises';

export function getFilesFromDir(path) {
    return fs.readdir(path, { withFileTypes: true })
}

export function filesToAlpfiles(dirents, path) {
    return dirents.map(dirent => {
        if (dirent.isDirectory()){
            return {
                name: dirent.name,
                isFolder: dirent.isDirectory()
            }
        } else {
            let pathFile = path + "/" + dirent.name;
            return getFileInfo(pathFile)
            .then((size)=>{
                return {
                    name: dirent.name,
                    isFolder: dirent.isDirectory(),
                    size : size
                }
            }
            )
        }
    })
}

export async function getFileInfo(path){
return fs.stat(path).then((stat)=>stat.size)
}

export async function createNeWDirectory(path, name) {

    try  {
    await fs.mkdir(path + name)
        return true
    }
    catch(error) {
        throw error
    }
}

export function regexTest(input){
    const regex = new RegExp("^[a-zA-Z0-9]*$");
    return regex.test(input);
}

export function deleteFileOrDirectory(path){
return fs.rm(path,{recursive:true})
}