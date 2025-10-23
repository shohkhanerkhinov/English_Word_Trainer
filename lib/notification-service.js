// Notification service for tracking missed days and sending reminders

export const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.log("[v0] Browser does not support notifications")
      return false
    }
  
    if (Notification.permission === "granted") {
      return true
    }
  
    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()
      return permission === "granted"
    }
  
    return false
  }
  
  export const sendNotification = (title, options = {}) => {
    if (Notification.permission === "granted") {
      new Notification(title, {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        ...options,
      })
    }
  }
  
  export const checkMissedDays = (userId) => {
    const lastVisitKey = `lastVisit_${userId}`
    const lastVisit = localStorage.getItem(lastVisitKey)
    const today = new Date().toDateString()
  
    if (!lastVisit) {
      // First visit
      localStorage.setItem(lastVisitKey, today)
      return { missedDays: 0, lastVisitDate: null }
    }
  
    if (lastVisit === today) {
      // Already visited today
      return { missedDays: 0, lastVisitDate: lastVisit }
    }
  
    // Calculate missed days
    const lastDate = new Date(lastVisit)
    const todayDate = new Date(today)
    const missedDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24))
  
    // Update last visit
    localStorage.setItem(lastVisitKey, today)
  
    return { missedDays, lastVisitDate: lastVisit }
  }
  
  export const sendMissedDayNotification = (missedDays) => {
    if (missedDays > 0) {
      const title = `You missed ${missedDays} day${missedDays > 1 ? "s" : ""}!`
      const message = `Come back and learn today's 10 words to keep your streak alive!`
  
      sendNotification(title, {
        body: message,
        tag: "missed-days",
        requireInteraction: true,
      })
    }
  }
  