import { Badge } from "@/components/ui/badge"

// 9 excelle  8 above 7 very good 6 good
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
    <div aria-label={`Rating of ${value} (${meaning}) `} role="figure">
      <Badge aria-hidden={true}>{value}</Badge>
      <span aria-hidden={true} className="px-2 border-r-2 border-dotted text-sm">
        {meaning}
      </span>
    </div>
  )
}

export default Rating
