import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

/**
 * Safely formats a date string to a human-readable format
 * @param dateString The date string to format. Supports ISO 8601 format with timezone (e.g. "2025-06-08T04:24:03.727+00:00")
 * @param format The format to use. Options: 'full', 'short', 'time', 'relative'
 * @param fallback The fallback value to use if the date is invalid
 * @returns A formatted date string or the fallback value if the date is invalid
 */
export function formatDate(
	dateString?: string | null,
	format: "full" | "short" | "time" | "relative" = "full",
	fallback: string = "N/A"
): string {
	try {
		if (!dateString) {
			return fallback
		}
		// Special handling for ISO 8601 format with timezone
		// This handles formats like "2025-06-08T04:24:03.727+00:00"
		let date: Date
		try {
			// Directly create Date object from the string
			date = new Date(dateString)

			// Additional validation
			if (!(date instanceof Date) || isNaN(date.getTime())) {
				console.warn(`Invalid date format: ${dateString}`)
				return fallback
			}
		} catch (error) {
			console.warn(`Error parsing date: ${dateString}`, error)
			return fallback
		}

		// Format based on the requested format type
		if (format === "full") {
			return new Intl.DateTimeFormat("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			}).format(date)
		}

		if (format === "short") {
			return new Intl.DateTimeFormat("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
			}).format(date)
		}

		if (format === "time") {
			return new Intl.DateTimeFormat("en-US", {
				hour: "numeric",
				minute: "numeric",
				hour12: true,
			}).format(date)
		}

		// Handle relative time format
		if (format === "relative") {
			return formatRelativeTime(date)
		}

		// Default to full format if somehow an invalid format is passed
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(date)
	} catch (error) {
		console.error("Date formatting error:", error)
		return fallback
	}
}

/**
 * Helper function to format a date relative to the current time
 */
function formatRelativeTime(date: Date): string {
	const now = new Date()
	const diffMs = now.getTime() - date.getTime()
	const diffSecs = Math.floor(diffMs / 1000)
	const diffMins = Math.floor(diffSecs / 60)
	const diffHours = Math.floor(diffMins / 60)
	const diffDays = Math.floor(diffHours / 24)

	if (diffSecs < 60) return "just now"
	if (diffMins < 60)
		return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`
	if (diffHours < 24)
		return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
	if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`

	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(date)
}
