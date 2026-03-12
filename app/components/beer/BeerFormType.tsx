export type BeerFormValues = {
  name: string
  style: string
  abv: number
  brewery_id: {
    label: string
    value: string
  }
  description: string
  ibu: number
  color: string
  cover_image:
    | {
        file?: File
        preview?: string
        url?: string
        type: "new" | "existing"
      }
    | null
  deleteCoverImage?: boolean
}