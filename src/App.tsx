import { useLocalStorage } from "usehooks-ts"
import useSWR from "swr"

import { HotelCard, LoadingHotelCard } from "@/components/sections/hotel"

import { CurrencyIdentifier, HotelInfo, HotelPrice } from "./types"
import { CurrencySelect } from "./components/common/currency-select"
import { fetcher, transformPricesToRecord } from "./lib/utils"
import ErrorBoundary from "./components/common/error-boundary"
import { Card } from "./components/ui/card"

function App() {
  const [currency, setCurrency] = useLocalStorage<CurrencyIdentifier>(
    "selected-currency",
    "USD"
  )

  const {
    data: hotels,
    error: hotelError,
    isLoading: hotelLoading,
  } = useSWR<HotelInfo[]>(
    "https://61c3e5d2f1af4a0017d99115.mockapi.io/hotels/tokyo",
    fetcher
  )

  const { data: hotelPrices, isLoading: pricesLoading } = useSWR<HotelPrice[]>(
    `https://61c3e5d2f1af4a0017d99115.mockapi.io/hotels/tokyo/1/${currency}`,
    fetcher
  )

  if (hotelLoading || pricesLoading) {
    return (
      <>
        <CurrencySelect disabled={true} value={currency} setValue={setCurrency} />
        {[...Array(10).keys()].map(key => {
          return <LoadingHotelCard key={key} />
        })}
      </>
    )
  }

  if (hotelError) {
    return (
      <p>
        Cannot fetch hotel information at this time. Try refreshing the page or check back
        again later.
      </p>
    )
  }

  if (hotels == null || hotels.length === 0) {
    return <p>No available hotel information at this time. Try again later.</p>
  }

  const hotelPriceRecord = transformPricesToRecord(hotelPrices ?? [])

  const sortedHotels = hotels.sort((a, b) => {
    if (hotelPriceRecord[a.id] != null) {
      return -1
    }

    if (hotelPriceRecord[b.id] != null) {
      return 1
    }

    return -1
  })

  return (
    <>
      <CurrencySelect value={currency} setValue={setCurrency} />
      {sortedHotels.map(hotelInfo => {
        return (
          <ErrorBoundary
            fallbackUI={
              <Card className="p-4 text-sm">
                Cannot display this hotel result at this time. Try refreshing the page of
                come back later.
              </Card>
            }
          >
            <HotelCard
              key={hotelInfo.id}
              {...hotelInfo}
              priceInfo={hotelPriceRecord[hotelInfo.id]}
              currency={currency}
            />
          </ErrorBoundary>
        )
      })}
    </>
  )
}

export default App
