import React, { useState } from 'react'
import { useChatContext } from 'stream-chat-react';

import { UserList } from './';
import { CloseCreateChannel, closeCreateChannel } from '../assets'

const ChannelNameInput = ({ channelName = '', setChannelName }) => {

    const handleChange = (event) => {
        event.preventDefault();
        setChannelName(event.target.value);
    }

    return (
        <div className="channel-name-input__wrapper">
            <p>Name</p>
            <input value={channelName} onChange={handleChange} placeholder="channel-name" />
            <p>Add Members</p>
        </div>
        
    )
}

const EditChannel = ({ setIsEditing }) => {
    // get channel name from chatContext
    const { channel } = useChatContext();

    // for setting channel name
    // if there is already a channel name, get it from channel
    const [channelName, setChannelName] = useState(channel?.data?.name);

    // modify to invite new users
    const [selectedUsers, setSelectedUsers] = useState([]);

    // update all changes
    const updateChannel = async (event) => {
        event.preventDefault();

        // check if user has changed the name
        const nameChanged = channelName !== (channel.data.name || channel.data.id);
        
        // if name has been changed
        if (nameChanged) {
            await channel.update({ name: channelName }, { text: `Channel name changed to ${channelName}`});
        }
        
        console.log(selectedUsers)
        console.log(channel.queryMembers({}).then((res) => {console.log(res.members)}))
        // if name hasn't changd, but new users have been added
        if (selectedUsers.length) {
            await channel.addMembers(selectedUsers);
            // await channel.update({}, {text: "hi"})
        }

        // cleanup
        setChannelName(null)
        setIsEditing(false)
        setSelectedUsers([])
    }

    return (
        <div className="edit-channel__container">
            <div className="edit-channel__header">
                <p>Edit Channel</p>
                <CloseCreateChannel setIsEditing={setIsEditing}/>
            </div>
            <ChannelNameInput channelName={channelName} setChannelName={setChannelName}/>
            <UserList setSelectedUsers={setSelectedUsers}/>
            <div className="edit-channel__button-wrapper" onClick={updateChannel}>
                <p>Save Changes</p>
            </div>
        </div>
    )
}

export default EditChannel
