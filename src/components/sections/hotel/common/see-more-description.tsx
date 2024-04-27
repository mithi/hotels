import { useState } from "react"
import { Button } from "@/components/ui/button"

export const SeeMoreDescription = ({ htmlString }: { htmlString: string }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {open && (
        <div
          className="text-sm text-muted-foreground pb-2 m-0"
          dangerouslySetInnerHTML={{ __html: htmlString }}
        />
      )}
      <Button
        variant="secondary"
        className="px-2  text-underline"
        onClick={() => setOpen(prev => !prev)}
      >
        {open ? "Hide" : "Show "} Description
      </Button>
    </>
  )
}

export default SeeMoreDescription
