// This file defines a basic health check endpoint.
// It can later be expanded with environment, database, and service checks.
export default defineEventHandler(() => {
  return {
    success: true,
    message: 'API is available.'
  }
})
