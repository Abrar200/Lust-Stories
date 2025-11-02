import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200">
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-pink-500 to-purple-500" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 shadow-lg transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-300 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 cursor-grab active:cursor-grabbing flex items-center justify-center">
      <div className="flex gap-1">
        <div className="w-0.5 h-4 bg-white/80 rounded-full" />
        <div className="w-0.5 h-4 bg-white/80 rounded-full" />
      </div>
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
