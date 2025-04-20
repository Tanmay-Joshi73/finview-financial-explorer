"use server"

import { revalidatePath } from "next/cache"

// Base URL for the API
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000/API"

// Upload bank statement
export async function uploadStatement(formData: FormData) {
  try {
    const response = await fetch(`${API_BASE_URL}/ProcessFile`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to upload statement: ${response.status}`)
    }

    const data = await response.json()
    revalidatePath("/")
    return data
  } catch (error) {
    console.error("Error uploading statement:", error)
    throw error
  }
}

// Fetch dashboard data
export async function fetchDashboardData() {
  try {
    const response = await fetch(`${API_BASE_URL}/Aggregate-Dashboard`, {
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch dashboard data: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return null
  }
}

// Fetch vendor data
export async function fetchVendorData() {
  try {
    const response = await fetch(`${API_BASE_URL}/Aggregate-VendorsData`, {
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch vendor data: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching vendor data:", error)
    return null
  }
}

// Fetch prediction data
export async function fetchPredictionData() {
  try {
    const response = await fetch(`${API_BASE_URL}/Overall`, {
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch prediction data: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching prediction data:", error)
    return null
  }
}

// Fetch investment data
export async function fetchInvestmentData() {
  try {
    const response = await fetch(`${API_BASE_URL}/Investment`, {
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch investment data: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching investment data:", error)
    return null
  }
}
