import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'

export const Notice = ({
  title,
  text,
  href,
  action,
}: {
  title?: string
  text: string
  href: string
  action: string
}) => (
  <div className="bg-muted/50 rounded-md border p-4 text-sm">
    {title && <p className="font-medium">{title}</p>}
    <p className="text-muted-foreground mt-1 mb-3">{text}</p>
    <Link href={href} className={buttonVariants()}>
      {action}
    </Link>
  </div>
)
