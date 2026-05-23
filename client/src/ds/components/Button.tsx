import React from "react"

type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "ghost" | "warning" | "destructive"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  className?: string
}

const variantMap = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/80",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
  ghost: "bg-transparent text-primary hover:bg-secondary",
  warning: "bg-warning text-warning-foreground hover:bg-warning/80",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
}

const sizeMap = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
}

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  className = "",
}: ButtonProps) => {
  const classes = [
    "inline-flex items-center justify-center rounded-md font-medium transition-colors cursor-pointer",
    variantMap[variant],
    sizeMap[size],
    disabled ? "opacity-50 cursor-not-allowed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}

export default Button
