import * as colors from 'colors';
import * as imagemin from 'imagemin';
import * as imageminWebp from 'imagemin-webp';
import * as path from 'path';

import { checkDirectory, getDirectoriesRecursive } from './helper';

const pathOfData = `${path.dirname(__dirname) + path.sep}data`;
const pathOfSourceImages = `${pathOfData + path.sep}files`;
checkDirectory(pathOfSourceImages);

export const convertToWebp = async (): Promise<any> => {
    const imageDirs = getDirectoriesRecursive(pathOfSourceImages);
    for (let i = 0; i < imageDirs.length; i++) {
        const dirPath = imageDirs[i];
        await imagemin([`${dirPath + path.sep}*.{jpg,jpeg,png,gif,JPG,JPEG,PNG,GIF}`], dirPath + path.sep, {
            use: [
                imageminWebp({quality: 90})
            ]
        }).catch((error) => {
            console.error(error);
        });
        console.log(`${
            (((+i + 1) / imageDirs.length) * 100).toFixed(0)
        }% - ${
            dirPath.replace(path.dirname(pathOfSourceImages), '')
        }`);
    }
};

convertToWebp().then(() => {
    console.log(colors.bold(colors.green('Images Optimized Successfully!')));
}).catch((error) => {
    console.error(error);
});
