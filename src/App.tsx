import { useLocalStorage } from "usehooks-ts"
import useSWR from "swr"
import HotelList from "@/components/sections/hotel-list"
import { LoadingHotelCard } from "@/components/sections/hotel"
import { CurrencyIdentifier, HotelInfo, HotelPrice } from "@/types"
import { CurrencySelect } from "@/components/common/currency-select"
import { fetcher } from "@/lib/utils"
import { HOTEL_URL, LOCAL_STORAGE_CURRENCY_KEY, PRICE_URL } from "./constants"
import { availableCurrenciesRecord } from "./lib/currencies"

function App() {
  const [currency, setCurrency] = useLocalStorage<CurrencyIdentifier>(
    LOCAL_STORAGE_CURRENCY_KEY,
    availableCurrenciesRecord.USD.name
  )

  const {
    data: hotels,
    error: hotelError,
    isLoading: hotelLoading,
    isValidating: hotelValidating,
  } = useSWR<HotelInfo[]>(HOTEL_URL, fetcher)

  const {
    data: hotelPrices,
    isLoading: pricesLoading,
    isValidating: priceValidating,
  } = useSWR<HotelPrice[]>(`${PRICE_URL}/${currency}`, fetcher)

  if (hotelLoading || pricesLoading || hotelValidating || priceValidating) {
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
