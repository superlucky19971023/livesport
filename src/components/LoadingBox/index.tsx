import type React from "react"
import { IonSpinner } from "@ionic/react"

interface LoadingBoxProps {
  message?: string
  spinnerName?: "lines" | "lines-small" | "dots" | "bubbles" | "circles" | "crescent"
  color?: string
  fullScreen?: boolean
}

export const LoadingBox: React.FC<LoadingBoxProps> = ({
  message = "Loading...",
  spinnerName = "crescent",
  color = "primary",
  fullScreen = false,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${
        fullScreen ? "fixed inset-0 z-50" : "w-full max-w-xs mx-auto"
      }`}
    >
      <IonSpinner name="dots" color={color} />
      {message && <p className="mt-4 text-center text-gray-700 dark:text-gray-300">{message}</p>}
    </div>
  )
}

export default LoadingBox

