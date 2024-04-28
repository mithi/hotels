import { ReactNode, useState } from "react"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const BasicPopover = ({
  trigger,
  content,
  side,
}: {
  trigger: ReactNode
  content: ReactNode
  side?: "top" | "right" | "bottom" | "left"
}) => {
  const [open, setOpen] = useState(false)

  const handleMouseEnter = () => {
    setOpen(true)
  }

  const handleMouseLeave = () => {
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {trigger}
      </PopoverTrigger>
      <PopoverContent
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        side={side ?? "bottom"}
      >
        {content}
      </PopoverContent>
      <PopoverAnchor />
    </Popover>
  )
}

export default BasicPopover
