import { imageResponse } from '@/lib/image-response'
import { getArticleImage } from '@/lib/store'

// A URL leva `?v=<updatedAt>`, então a foto pode ser cacheada para sempre.
export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await params
  const image = await getArticleImage(slug)
  return imageResponse(image, 'public, max-age=31536000, immutable')
}
