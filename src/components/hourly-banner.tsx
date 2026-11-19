import { cacheLife } from 'next/cache'
import Image from 'next/image'

import { BANNERS } from '@/lib/banners'

const HOUR_IN_MS = 60 * 60 * 1000
const FIVE_MINUTES_IN_SECONDS = 5 * 60
const HOUR_IN_SECONDS = 60 * 60

// Rodízio: cada hora mostra o próximo banner da lista, voltando ao início.
// O cache revalida a cada 5 minutos para a troca acontecer perto da virada
// da hora, mas a página continua estática entre uma revalidação e outra.
// oxlint-disable-next-line require-await -- 'use cache' exige função async
const getBannerOfTheHour = async () => {
  'use cache'
  cacheLife({
    stale: FIVE_MINUTES_IN_SECONDS,
    revalidate: FIVE_MINUTES_IN_SECONDS,
    expire: HOUR_IN_SECONDS,
  })

  const hoursSinceEpoch = Math.floor(Date.now() / HOUR_IN_MS)
  return BANNERS[hoursSinceEpoch % BANNERS.length]
}

export const HourlyBanner = async () => {
  const banner = await getBannerOfTheHour()
  if (!banner) {
    return null
  }

  return (
    <Image
      src={banner}
      alt=""
      className="object-cover object-center"
      fill
      preload
      sizes="100vw"
    />
  )
}
