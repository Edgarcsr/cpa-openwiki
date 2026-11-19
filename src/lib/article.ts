export interface ArticleMetadata {
  title: string
  image: { src: string; alt: string }
  infobox: [label: string, value: string][]
}
