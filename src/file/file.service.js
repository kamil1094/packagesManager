import fs from 'fs';
import { inspect } from 'util';

const updateFile = async (path, packageName, packageVersion) => {
    const file = fs.readFileSync(path, 'utf8');

    if (!file) {
        console.log(`file: ${path} not found`);
        return false;
    }
  
    let parsedFile;
  
    try {
        parsedFile = JSON.parse(file);
    } catch (err) {
        throw new Error(`Error occured while parsing file`, inspect(err))
    }

    if (parsedFile.dependencies && parsedFile.dependencies[packageName]) {
        parsedFile.dependencies[packageName] = packageVersion;

        fs.writeFileSync(path, JSON.stringify(parsedFile));

        return true;
    }

    // @TODO: add option to create dependency
}

const getFilesLocations = (path, fileName = 'package.json') => {
    const Allfiles = fs.readdirSync(path);

    const files = [];

    for (const file of Allfiles) {
        const filePath = `${path}/${file}`;
        if (file === fileName) {
            files.push(filePath);
        }
        // @TODO: add nested files search
    }

    return files;
}

export default async function updateFiles (repository, packageVersion, packageName) {
    const repoDir = `${process.env.TEMP_REPO_DIR}/${repository}`;

    const filesLocations = getFilesLocations(repoDir);
    const changedLocations = [];
    for (const fileLocation of filesLocations) {
        if (await updateFile(fileLocation, packageVersion, packageName)) {
            changedLocations.push(fileLocation.replace(repoDir + '/', ''));
        }
    }

    return changedLocations;
}