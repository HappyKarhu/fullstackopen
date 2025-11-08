import "./notification.css"
import { useNotification } from "../context/NotificationContext"

const Notification = () => {
  const {notification} = useNotification()
  if (!notification) return null

  const className = notification.type === "error" ? "wrongUser" : "newBlogadded"

  return <div className={className}>{notification.message}</div>
}

export default Notification;