import * as colors from 'colors';
import * as fs from 'fs';
import * as path from 'path';

export const checkDirectory = (directoryPath: string) => {
    if (!fs.existsSync(directoryPath)) {
        directoryPath.split(path.sep)
            .reduce(
                (currentPath, folder) => {
                    const dirPath = currentPath + folder + path.sep;
                    if (!fs.existsSync(dirPath)) {
                        fs.mkdirSync(dirPath);
                    }

                    return dirPath;
                },
                '');
    }
};

export const writeResultToFile = (pathOfDataJson, dataFirestore) => {
    fs.writeFile(
        pathOfDataJson,
        JSON.stringify(dataFirestore, undefined, 2),
        {encoding: 'utf8', flag: 'w'}, (err) => {
            if (err) {
                throw err;
            }
            console.log(colors.bold(colors.green('File Saved Successfully!')));
        });
};

export const isDirectory = (source) => fs.lstatSync(source).isDirectory();

export const getDirectories = (source) =>
    fs.readdirSync(source)
        .map((name) => path.join(source, name))
        .filter(isDirectory);

export const getDirectoriesRecursive = (source) => [
    source,
    ...getDirectories(source)
        .map(getDirectoriesRecursive)
        .reduce((a, b) => a.concat(b), [])
];
