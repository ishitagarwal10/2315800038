// logging_middleware/logger.js

const LOG_API_URL = "http://4.224.186.213/evaluation-service/logs";

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJpc2hpdGEuYWdhcndhbDE5OUBnbWFpbC5jb20iLCJleHAiOjE3ODEwNzMxMjEsImlhdCI6MTc4MTA3MjIyMSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6Ijk0Mjg5ZDdlLWVmZWMtNGNlYS1hZjRkLTNjN2RhY2NkZmRiYyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImlzaGl0YSBhZ2Fyd2FsIiwic3ViIjoiMDUxZWNhZDEtYTI0Zi00MzFhLWE4MGEtMTEyNTg5N2MyZTViIn0sImVtYWlsIjoiaXNoaXRhLmFnYXJ3YWwxOTlAZ21haWwuY29tIiwibmFtZSI6ImlzaGl0YSBhZ2Fyd2FsIiwicm9sbE5vIjoiMjMxNTgwMDAzOCIsImFjY2Vzc0NvZGUiOiJSUHNnWXQiLCJjbGllbnRJRCI6IjA1MWVjYWQxLWEyNGYtNDMxYS1hODBhLTExMjU4OTdjMmU1YiIsImNsaWVudFNlY3JldCI6IkV4c0pKcXpFVEpHUGVZcXoifQ.ZQOq_S5mfJ1qAH_eOn_DPbJ73KvdEkYm2jJ76oZftLg"; 

/**
 * Reusable Logging function to send application metrics directly to the Test Server.
 * 
 * @param {string} stack - Accepted value: "frontend"
 * @param {string} level - Accepted values: "debug" | "info" | "warn" | "error" | "fatal"
 * @param {string} pkg - Accepted values: "api" | "component" | "hook" | "page" | "state" | "style" | "auth" | "config" | "middleware" | "utils"
 * @param {string} message - Clear, descriptive context string about what occurred
 */
export async function Log(stack, level, pkg, message) {
  const payload = {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: pkg.toLowerCase(),
    message: message
  };

  try {
    const response = await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    // Basic fallback logic if network disconnect happens locally
    return { error: true, message: error.message };
  }
}