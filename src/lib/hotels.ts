import {
  CurrencyIdentifier,
  GenericItem,
  HotelInfo,
  HotelPrice,
  ProviderItem,
} from "@/types"
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
    if (a.price === b.price) {
      return a.highlighted ? -1 : 1
    }

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

export const moveUnavailableHotelPricesToBottom = (
  hotels: HotelInfo[],
  hotelPriceRecord: Record<number, HotelPrice>
): HotelInfo[] => {
  const hotelsWithPrice = hotels.filter(hotel => hotelPriceRecord[hotel.id] != null)
  const hotelsWithoutPrice = hotels.filter(hotel => hotelPriceRecord[hotel.id] == null)
  return [...hotelsWithPrice, ...hotelsWithoutPrice]
}

export type PriceInfoPresentation = {
  price?: string
  taxesAndFeesBreakdown?: {
    beforeFees: string
    tax: string
    hotelFee: string
  } | null
  sortedProviders?: GenericItem[]
  saveUpTo?: number | null
  competitorPrice?: string
}

export const priceInfoToPresentation = (
  currency: CurrencyIdentifier,
  priceInfo?: Omit<HotelPrice, "id">
): PriceInfoPresentation => {
  if (priceInfo?.price == null) {
    return {}
  }

  const price = priceDisplay(priceInfo.price, currency)
  const taxesAndFeesBreakdown =
    priceInfo.taxes_and_fees == null
      ? null
      : {
          beforeFees: priceDisplay(
            priceInfo.price -
              priceInfo.taxes_and_fees.tax -
              priceInfo.taxes_and_fees.hotel_fees,
            currency
          ),
          tax: priceDisplay(priceInfo.taxes_and_fees.tax, currency),
          hotelFee: priceDisplay(priceInfo.taxes_and_fees.hotel_fees, currency),
        }

  if (priceInfo?.competitors == null || Object.keys(priceInfo.competitors).length === 0) {
    return {
      price,
      taxesAndFeesBreakdown,
    }
  }

  const otherProviders: ProviderItem[] = providerRecordToArray(priceInfo.competitors)
  const mostExpensive = mostExpensiveProvider(otherProviders)

  /* Assume that "Our Price" is a reserved provider here */
  const sortedProviders = providersToSortedGenericItems(
    [
      ...otherProviders,
      { provider: "Our Price", price: priceInfo.price, highlighted: true },
    ],
    currency
  )

  const savingsInfo =
    priceInfo.price < mostExpensive.price
      ? {
          saveUpTo: computeSavings(priceInfo.price, mostExpensive.price),
          competitorPrice: priceDisplay(mostExpensive.price, currency),
        }
      : {}

  return {
    price,
    taxesAndFeesBreakdown,
    sortedProviders,
    ...savingsInfo,
  }
}
