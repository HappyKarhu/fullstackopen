import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'

const Notification = () => {
  const notification=useSelector(state => state.notification)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    backgroundColor: '#b3e271ff'
  }

  if (!notification) return null
  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification