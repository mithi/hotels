import { CurrencyIdentifier, GenericItem, HotelPrice, ProviderItem } from "@/types"
import { priceDisplay } from "./currencies"

/* map hotelId -> HotelPrice */
export const transformPricesToRecord = (
  prices: HotelPrice[]
): Record<number, HotelPrice> => {
  return prices.reduce(
    (acc, current) => {
      acc[current.id] = current
      return acc
    },
    {} as Record<number, HotelPrice>
  )
}

export const providerRecordToArray = (
  competitors: Record<string, number>
): ProviderItem[] => {
  return Object.entries(competitors).map(entry => {
    const [provider, price] = entry
    return { provider, price }
  })
}

export const mostExpensiveProvider = (providers: ProviderItem[]): ProviderItem => {
  return providers.reduce((acc, provider) => {
    return acc && acc.price > provider.price ? acc : provider
  })
}

export const computeSavings = (price: number, otherPrice: number) => {
  return ((otherPrice - price) / otherPrice) * 100
}

export const providersToSortedGenericItems = (
  providers: ProviderItem[],
  currency: CurrencyIdentifier
): GenericItem[] => {
  const sortedProviders = providers.sort((a, b) => {
    return a.price < b.price ? -1 : 1
  })

  const genericItems: GenericItem[] = sortedProviders.map(item => {
    return {
      field: item.provider,
      value: priceDisplay(item.price, currency),
      highlighted: item.highlighted,
    }
  })
  return genericItems
}
