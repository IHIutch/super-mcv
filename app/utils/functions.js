import { nanoid } from 'nanoid-good'
import en from 'nanoid-good/locale/en'

export function getNanoId() {
  const handleGetNanoId = nanoid(en)
  return handleGetNanoId(12)
}
