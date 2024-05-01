import { Badge } from "@/components/ui/badge"

// Note: we can change the meaning of each rating depending on specs
// 9 excellent,  8 above, 7 very good, 6 good, Review Score
export const Rating = ({ value }: { value: number }) => {
  const meaning =
    value >= 9
      ? "Excellent"
      : value >= 8
        ? "Great"
        : value >= 7
          ? "Very Good"
          : value >= 6
            ? "Good"
            : "Review Score"
  return (
    <figure aria-label={`Rating of ${value} (${meaning}) `}>
      <Badge aria-hidden={true}>{value}</Badge>
      <span aria-hidden={true} className="px-2 border-r-2 border-dotted text-sm">
        {meaning}
      </span>
    </figure>
  )
}

export default Rating
