import { Skeleton } from "@/components/ui/skeleton"
import { HotelCardLayout } from "./common"

export const LoadingHotelCard = () => {
  return (
    <HotelCardLayout
      photo={<Skeleton className="min-h-[175px] w-[200px] sm:w-[200px] lg:w-[250px]" />}
      title={<Skeleton className="w-full h-[45px]" />}
      address={""}
      rating={<Skeleton className="mr-1 w-[100px] h-[25px]" />}
      stars={<Skeleton className="mr-1 w-[150px] h-[25px]" />}
      description={<Skeleton className="w-[150px] h-[30px]" />}
      availableProviders={null}
      booking={<Skeleton className="shrink-0 border rounded-lg h-[100px] w-[180px]" />}
    />
  )
}

export default LoadingHotelCard
