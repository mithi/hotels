export type HotelInfo = {
  address: string
  description: string
  id: number
  name: string
  photo: string
  rating: number
  stars: number
}

export type HotelPrice = {
  id: number
  price: number
  competitors?: Record<string, number>
  taxes_and_fees?: {
    tax: number
    hotel_fees: number
  }
}

export type CurrencyIdentifier = "KRW" | "CNY" | "SGD" | "USD"

export type CurrencyInfo = {
  symbol: string
  name: CurrencyIdentifier
  description: string
}

export type ProviderItem = { provider: string; price: number; highlighted?: boolean }
export type GenericItem = { field: string; value: string; highlighted?: boolean }
