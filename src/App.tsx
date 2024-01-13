import React from "react";
import "./App.css";
import Routespage from "./Routes/Routespage";

function App() {
  // socket.off('notifications').on('notifications', (room, id, sender) => {
  //   if (room != currentRoom && currentUserVal._id == id) {
  //     currentUserVal.newMessages[room] = (currentUserVal.newMessages[room] || 0) + 1
  //     let totalMessage = Object.values(currentUserVal?.newMessages).length && Object.values(currentUserVal?.newMessages)?.reduce((a, b) => a + b)
  //     const roomsCount = Object.keys(currentUserVal.newMessages).length
  //     setNotificationRooms(roomsCount)
  //     setTotalMessages(totalMessage)
  //     setCurrentUserVal(currentUserVal)
  //     // alert('You got a message from ' + sender.fName)
  //     if ('Notification' in window && Notification.permission === 'granted') {
  //       const notification = new Notification('Message', {
  //         body: `You got a message from ${sender.fName}`,
  //         icon: cLogo,
  //         // Other options like icon, badge, etc.
  //       });
  //     }
  //     alert(`You got a message from ${sender.fName}`)
  //   }
  // })
  return (
    <div className="App">
      <Routespage />
    </div>
  );
}

export default App;
