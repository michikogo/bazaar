import React from "react"

type FlexProps = {
  children: React.ReactNode
  direction?: "row" | "col"
  gap?: "0" | "1" | "2" | "4" | "6" | "8"
  align?: "start" | "center" | "end" | "stretch"
  justify?: "start" | "center" | "end" | "between"
  wrap?: boolean
  className?: string
}

const directionMap = {
  row: "flex-row",
  col: "flex-col",
}

const gapMap = {
  "0": "gap-0",
  "1": "gap-1",
  "2": "gap-2",
  "4": "gap-4",
  "6": "gap-6",
  "8": "gap-8",
}

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
}

const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
}

const Flex = ({
  children,
  direction = "row",
  gap = "0",
  align = "start",
  justify = "start",
  wrap = false,
  className = "",
}: FlexProps) => {
  const classes = [
    "flex",
    directionMap[direction],
    gapMap[gap],
    alignMap[align],
    justifyMap[justify],
    wrap ? "flex-wrap" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return <div className={classes}>{children}</div>
}

export default Flex
