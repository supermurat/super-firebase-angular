import { ImageModel } from './image-model';
/**
 * Carousel Item Class
 */
export class CarouselItemModel extends ImageModel {
    /** caption of carousel item */
    caption?: string;
    /** text of carousel item */
    text?: string;
}
