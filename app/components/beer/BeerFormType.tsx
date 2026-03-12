/**
 * Shared base fields present in both CreateBeerForm and EditBeerForm.
 * Used to type BeerCommonFields and BrewerySelectField props.
 */
export type BeerBaseFields = {
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
  [key: string]: unknown
}

/**
 * @deprecated Use BeerBaseFields or form-specific types from beerSchema instead.
 * Kept for reference only.
 */
export type BeerFormValues = BeerBaseFields & {
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