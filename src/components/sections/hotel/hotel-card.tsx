import { MapPin } from "lucide-react"
import { CurrencyIdentifier, HotelInfo, HotelPrice } from "@/types"
import BasicPopover from "@/components/common/basic-popover"
import { PriceInfoPresentation, priceInfoToPresentation } from "@/lib/hotels"
import {
  HotelCardLayout,
  PriceItem,
  ProviderPriceTable,
  Rating,
  SeeMoreDescription,
  HotelStars,
} from "./common"
import {
  BookingAction,
  BookingCardLayout,
  PriceBreakdownPopover,
  PriceNotAvailable,
  PriceWarning,
  Savings,
  StrikeThroughPrice,
} from "./common/booking-card"

function HotelCard({
  name,
  address,
  photo,
  stars,
  rating,
  description,
  priceInfo,
  currency,
}: HotelInfo & { priceInfo?: HotelPrice } & { currency: CurrencyIdentifier }) {
  const info: PriceInfoPresentation = priceInfoToPresentation(currency, priceInfo)

  return (
    <HotelCardLayout
      photo={<img className="rounded-md" src={photo} alt={`Preview Image for ${name}`} />}
      title={name}
      address={
        <>
          <MapPin
            opacity={0.6}
            strokeWidth="1"
            className={"scale-90"}
            aria-hidden={true}
          />
          {address}
        </>
      }
      description={<SeeMoreDescription htmlString={description} />}
      rating={<Rating value={rating} />}
      stars={<HotelStars value={stars} />}
      availableProviders={
        info.sortedProviders && (
          <div className="flex gap-2 flex-col sm:flex-row">
            {info.sortedProviders.map(provider => {
              return <PriceItem key={provider.field} {...provider} />
            })}
          </div>
        )
      }
      seeProviderBreakdown={
        info.sortedProviders && (
          <div className="absolute bottom-2">
            <BasicPopover
              trigger={
                <span className="underline text-muted-foreground text-sm">
                  Compare all {info.sortedProviders.length} prices
                </span>
              }
              content={<ProviderPriceTable items={info.sortedProviders} />}
            />
          </div>
        )
      }
      booking={
        <BookingCardLayout
          savings={info.saveUpTo != null && <Savings value={info.saveUpTo} />}
          strikethroughPrice={
            info.competitorPrice && <StrikeThroughPrice value={info.competitorPrice} />
          }
          price={
            info.price == null ? (
              <PriceNotAvailable />
            ) : info.taxesAndFeesBreakdown ? (
              <PriceBreakdownPopover
                price={info.price}
                taxesAndFeesBreakdown={info.taxesAndFeesBreakdown}
              />
            ) : (
              info.price
            )
          }
          subtitle={
            info.price && (
              <PriceWarning hasBreakdown={info.taxesAndFeesBreakdown != null} />
            )
          }
          action={<BookingAction />}
        />
      }
    />
  )
}

export default HotelCard
