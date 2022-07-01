import React, { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie'

import { ChannelContainer, ChannelListContainer, Auth } from './components'

import 'stream-chat-react/dist/css/index.css'
import './App.css'


// get data from cookies
const cookies = new Cookies();

const apiKey = '8hyz5yf5q3hr';

// Render auth
// token only available when logged in
// const authToken = false;

// use cookie for auth token
const authToken = cookies.get("token");


// Create instance of stream chat
const client = StreamChat.getInstance(apiKey);

// if there is the authToken, create the user
if (authToken) {
  client.connectUser({
    // pass everything from cookies here
    id: cookies.get('userId'),
    name: cookies.get('username'),
    fullName: cookies.get('fullName'),
    image: cookies.get('avatarURL'),
    hashedPassword: cookies.get('hashedPassword'),
    phoneNumber: cookies.get('phoneNumber'),
  }, authToken)
}

const App = () => {

  // need to know info about creating channel inside both channelList and channel container
  // declare state inside App()
  const [createType, setCreateType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 

  // if not logged in, return auth component and hide below
  if (!authToken) return <Auth />

  return (
    <div className="app__wrapper">
      <Chat client={client} theme="team light">
        {/* Pass as props to components */}
        <ChannelListContainer 
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
        />

        <ChannelContainer 
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          createType={createType}
        />
      </Chat>
    </div>
  )
}
export default App;
