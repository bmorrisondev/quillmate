import { PenLine, Sparkles, Users } from "lucide-react"
import { type ReactElement } from "react"

/** Represents a core feature of Quillmate with its visual and textual properties */
interface Feature {
  /** Lucide icon component to represent the feature */
  icon: typeof Sparkles
  /** Short title describing the feature */
  title: string
  /** Detailed description of the feature's benefits */
  description: string
  /** Tailwind CSS color class for the icon */
  iconColor: string
}

/** Core features of the Quillmate application */
const features: Feature[] = [
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Advanced AI assistance for better writing",
    iconColor: "text-purple-500"
  },
  {
    icon: Users,
    title: "Collaborative",
    description: "Write and edit together in real-time",
    iconColor: "text-blue-500"
  },
  {
    icon: PenLine,
    title: "Intuitive",
    description: "Simple and powerful writing experience",
    iconColor: "text-indigo-500"
  }
]

/**
 * Displays a responsive grid of Quillmate's core features with icons and descriptions.
 * Features include AI-powered assistance, real-time collaboration, and intuitive interface.
 * Supports both light and dark modes with consistent styling.
 * 
 * @returns A responsive grid of feature cards with icons and descriptions
 */
export function FeaturesGrid(): ReactElement {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-4">
      {features.map((feature) => {
        const Icon = feature.icon
        return (
          <div key={feature.title} className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <Icon className={`w-8 h-8 ${feature.iconColor}`} />
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
          </div>
        )
      })}
    </div>
  )
}
