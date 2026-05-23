import React from "react"

type CardProps = {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

const Card = ({ children, onClick, className = "" }: CardProps) => {
  const classes = [
    "bg-white rounded-xl border border-gray-200 overflow-hidden",
    onClick ? "cursor-pointer hover:shadow-md transition-shadow" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  )
}

export default Card
