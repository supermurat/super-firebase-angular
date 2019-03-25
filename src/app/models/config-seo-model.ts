import { ImageModel } from './image-model';
/**
 * Config SEO Class
 */
export class ConfigSeoModel {
    /** default image for SEO */
    defaultImageForSEO?: ImageModel;
    /** default publisher for SEO */
    defaultPublisher?: {
        /** logo of publisher */
        logo: {
            /** type of logo */
            '@type': string,
            /** height of logo */
            height: number,
            /** url of logo */
            url: string,
            /** width of logo */
            width: number
        },
        /** name of publisher */
        name: string
    };
}
