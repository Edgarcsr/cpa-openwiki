import bannerA from './assets/banners/5c8e939c-2587-40e3-b7b0-d6df88b17d95.png'
import bannerB from './assets/banners/b5fd9317-4217-4f4b-b0b9-8e2347ed94b1.png'
import bannerDefault from './assets/banners/banner.png'
import bannerC from './assets/banners/f0b21943-7ccb-4a9f-9385-dcdebf7b6b4d.png'

// Tudo que muda de uma wiki para outra fica aqui. A engine (src/) não tem
// nomes, textos ou links fixos.
export const openwikiConfig = {
  name: 'OpenWiki',
  description: 'Uma enciclopédia aberta e feita em comunidade.',
  locale: 'pt-BR',
  hero: {
    title: 'A enciclopédia aberta, feita em comunidade.',
    subtitle:
      'Conte a história das pessoas, dos lugares e dos momentos que importam, do seu jeito e em qualquer idioma.',
  },
  // Slug de um artigo em content/articles/.
  featuredArticle: 'alexandre-fernandes',
  banners: [bannerDefault, bannerA, bannerB, bannerC],
}
