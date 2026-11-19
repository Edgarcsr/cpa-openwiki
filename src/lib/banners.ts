import type { StaticImageData } from 'next/image'

import bannerA from '../../public/banners/5c8e939c-2587-40e3-b7b0-d6df88b17d95.png'
import bannerB from '../../public/banners/b5fd9317-4217-4f4b-b0b9-8e2347ed94b1.png'
import bannerDefault from '../../public/banners/banner.png'
import bannerC from '../../public/banners/f0b21943-7ccb-4a9f-9385-dcdebf7b6b4d.png'

export const BANNERS: StaticImageData[] = [
  bannerDefault,
  bannerA,
  bannerB,
  bannerC,
]
