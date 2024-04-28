import { useLocalStorage } from "usehooks-ts"
import useSWR from "swr"
import HotelList from "@/components/sections/hotel-list"
import { LoadingHotelCard } from "@/components/sections/hotel"
import { CurrencyIdentifier, HotelInfo, HotelPrice } from "@/types"
import { CurrencySelect } from "@/components/common/currency-select"
import { fetcher } from "@/lib/utils"

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

  return (
    <>
      <CurrencySelect value={currency} setValue={setCurrency} />
      <HotelList hotels={hotels} currency={currency} prices={hotelPrices ?? []} />
    </>
  )
}

export default App
