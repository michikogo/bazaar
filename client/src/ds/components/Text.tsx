import React from "react"

type TextProps = {
  children: React.ReactNode
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl"
  weight?: "normal" | "medium" | "semibold" | "bold"
  color?: "default" | "muted" | "strong"
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4"
  className?: string
}

const sizeMap = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
}

const weightMap = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
}

const colorMap = {
  default: "text-gray-800",
  muted: "text-gray-500",
  strong: "text-gray-950",
}

const Text = ({
  children,
  size = "base",
  weight = "normal",
  color = "default",
  as: Tag = "p",
  className = "",
}: TextProps) => {
  const classes = [sizeMap[size], weightMap[weight], colorMap[color], className]
    .filter(Boolean)
    .join(" ")

  return <Tag className={classes}>{children}</Tag>
}

export default Text
