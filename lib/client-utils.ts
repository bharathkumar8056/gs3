// This file contains utility functions that should only run on the client side

/**
 * Safely access window object
 * @returns true if window is defined (client-side), false otherwise
 */
export const isClient = typeof window !== "undefined"

/**
 * Safely access browser APIs
 * @param fn Function to execute on client side
 */
export const runOnClient = (fn: Function) => {
  if (isClient) {
    fn()
  }
}

/**
 * Safely access browser APIs with a delay
 * @param fn Function to execute on client side
 * @param delay Delay in milliseconds
 */
export const runOnClientWithDelay = (fn: Function, delay = 0) => {
  if (isClient) {
    setTimeout(() => {
      fn()
    }, delay)
  }
}

/**
 * Check if WebGL is supported with better error handling
 * @returns true if WebGL is supported, false otherwise
 */
export const isWebGLSupported = () => {
  if (!isClient) return false

  try {
    const canvas = document.createElement("canvas")
    // Try to get WebGL2 first, then fall back to WebGL
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl")

    return !!gl
  } catch (e) {
    console.error("WebGL detection error:", e)
    return false
  }
}
