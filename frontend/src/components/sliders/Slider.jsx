import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';

const initOptions = {
  label: 'Bilder im Slider',
  type: 'fade',
  rewind: true,
  cover: true,
  autoplay: true,
  interval: 4000,
  speed: 800,
  arrows: true,
  pagination: true,
  pauseOnHover: true,
  pauseOnFocus: true,
  i18n: {
    prev: 'Vorheriges Bild',
    next: 'Nächstes Bild',
    first: 'Erstes Bild',
    last: 'Letztes Bild',
    play: 'Automatischen Bildwechsel starten',
    pause: 'Automatischen Bildwechsel pausieren',
    slideX: 'Gehe zu Bild %s',
    pageX: 'Gehe zu Seite %s',
    select: 'Bild zum Anzeigen auswählen',
    slideLabel: '%s von %s',
    carousel: 'Bilderkarussell',
  },
};

const Slider = (props) => {
  const { label = initOptions.label, options = initOptions } = props;
  const slides =
    props.slides ||
    Object.keys(import.meta.glob('/public/img/slides/*.{jpg,jpeg,png,webp,avif}'))
      .sort()
      .map((path) => path.replace('/public', ''));

  return (
    <>
      {slides.length > 0 && (
        <Splide
          className="slider"
          aria-label="Hintergrundbilder im Header"
          hasTrack={false}
          options={{
            initOptions,
            ...options,
            label,
          }}>
          <SplideTrack>
            {slides.map((src) => (
              <SplideSlide key={src}>
                <img src={src} alt="" />
              </SplideSlide>
            ))}
          </SplideTrack>
        </Splide>
      )}
    </>
  );
};
export default Slider;
