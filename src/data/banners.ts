export type HomeBanner = {
  id: string;
  src: string;
  alt: string;
  objectPosition: string;
};

export const homeBanners: HomeBanner[] = [
  {
    id: "studio-mixer",
    src: "/banners/studio-mixer-banner-01.jpg",
    alt: "Професионален аудио пулт със сценично осветление",
    objectPosition: "center center",
  },
  {
    id: "microphones-mixer",
    src: "/banners/microphones-mixer-banner-02.jpg",
    alt: "Микрофони върху професионален озвучителен пулт",
    objectPosition: "center 44%",
  },
];