import React, {useState} from 'react'
import { useChat, useChatContext } from 'stream-chat-react';

import { UserList } from './';
import { CloseCreateChannel } from '../assets'

// create new component
const ChannelNameInput = ({ channelName = '', setChannelName }) => {

    const handleChange = (event) => {
        event.preventDefault();
        setChannelName(event.target.value);
    }

    return (
        <div className="channel-name-input__wrapper">
            <p>Name</p>
            <input value={channelName} onChange={handleChange} placeholder="channel-name" required/>
            <p>Add Members</p>
        </div>
    )
}

const CreateChannel = ({ createType, setIsCreating }) => {

    // keep track of selected users
    // at the start, we only want our own id, since we always want to be in the channel that we create
    const { client, setActiveChannel } = useChatContext();
    const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);

    const [channelName, setChannelName] = useState('');

    const createChannel = async(e) => {
        e.preventDefault();
        try {
            // creating a new channel
            // check for type (team or dm)
            const newChannel = await client.channel(
                createType, 
                channelName,
                {
                    name: channelName,
                    members: selectedUsers
                });
            
            // after creating the channel, keep watching the channel for new messages
            await newChannel.watch();

            // do cleanup after creating new channel
            setChannelName('');
            setIsCreating(false)
            setSelectedUsers([client.userID]); // always want to be in the channel we create
            setActiveChannel(newChannel)

        } catch (error) {
            console.log(error)
        }
    }


    //console.log(createType)
    return (
        <div className="create-channel__container">
            <div className="create-channel__header">
                <p>{createType === 'team' ? 'Create a New Channel' : 'Send a Direct Message'}</p>
                <CloseCreateChannel setIsCreating={setIsCreating} />
            </div>
            {/* <ChannelNameInput /> */}
            {createType === 'team' && <ChannelNameInput channelName={channelName} setChannelName={setChannelName} />}
            <UserList setSelectedUsers={setSelectedUsers}/>
            <div className="create-channel__button-wrapper" onClick={createChannel}>
                <p>{createType === 'team' ? 'Create Channel' : "Create Direct Message"}</p>
            </div>
        </div>
    )
}

export default CreateChannel
