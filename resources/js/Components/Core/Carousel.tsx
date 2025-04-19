import { Image } from '@/types';

type Props = { images: Image[] };

const Carousel = ({ images }: Props) => {
  return (
    <div className="flex items-start gap-8">
      <div className="flex flex-col items-center gap-2 py-2">
        {images?.map((image, i) => (
          <a
            key={image.id}
            href={'#image' + i}
            className="btn btn-xs border-2 hover:border-blue-500"
          >
            <img src={image.thumb} alt="" className="w-50px aspect-auto" />
          </a>
        ))}
      </div>
      <div className="carousel w-full">
        {images?.map((image, i) => (
          <div key={image.id} id={'image' + i} className="carousel-item w-full">
            <img src={image.large} className="w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
