import "./notification.css"
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)
  if (!notification.message) return null;
  const className = notification.type === "error" ? "wrongUser" : "newBlogadded";

  return <div className={className}>{notification.message}</div>;
};

export default Notification;