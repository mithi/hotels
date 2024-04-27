import { ReactNode } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const BasicPopover = ({
  trigger,
  content,
  side,
}: {
  trigger: ReactNode
  content: ReactNode
  side?: "top" | "right" | "bottom" | "left"
}) => {
  return (
    <Popover>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent side={side ?? "top"}>{content}</PopoverContent>
    </Popover>
  )
}

export default BasicPopover
