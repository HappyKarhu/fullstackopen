import './notification.css'

const Notification = ({ message, type }) => {
  if (!message) return null
  const className = type=== 'error' ? 'wrongUser' : 'newBlogadded'
    
  return (
    <div className={className}>
      {message}
    </div>
  )
}

export default Notification