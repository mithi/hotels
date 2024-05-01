import { Star } from "lucide-react"

const HotelStars = ({ value }: { value: number }) => {
  return (
    <div className="flex mx-2" role="img" aria-label={`${value} star hotel`}>
      {[...Array(value).keys()].map(star => {
        return (
          <Star
            data-icon="hotel-star"
            key={star}
            stroke="orange"
            fill="orange"
            fillOpacity={0.55}
            strokeWidth={2}
          />
        )
      })}
    </div>
  )
}

export default HotelStars
