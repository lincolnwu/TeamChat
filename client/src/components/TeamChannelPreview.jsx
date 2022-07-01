import React from 'react'
import { Avatar, useChatContext } from 'stream-chat-react';

const TeamChannelPreview = ({ channel, type, setToggleContainer, setIsCreating, setIsEditing, setActiveChannel }) => {
    const { channel: activeChannel, client } = useChatContext(); // call this as a hook

    // Channel Preview for multiple users, must supply channel and data
    const ChannelPreview = () => (
        <p className="channel-preview__item">
            # {channel?.data?.name || channel?.data?.id} 
        </p>
    );



    // Channel preview for direct messages
    const DirectPreview = () => {
        // Take values from key-pair objects
        // Map over all users
        // Keep IDs that are not equal to client ID (our own ID) so we can get the users to talk to
        const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);
        
        // console.log(members[0])

        return (
            <div className="channel-preview__item single">
                <Avatar
                    image={members[0]?.user?.image}
                    name={members[0]?.user?.fullName}
                    size={24}
                />
                <p>{members[0]?.user?.fullName || members[0]?.user?.id}</p>
            </div>
        )
    }

    return (
        // Different div class depending on whether it's selected or not
        // using dynamic block
        <div className={
            channel?.id === activeChannel?.id 
            ? 'channel-preview__wrapper__selected' 
            : 'channel-preview__wrapper'
        }
        onClick={() => {
            setIsCreating(false);
            setIsEditing(false);
            setActiveChannel(channel);

            if (setToggleContainer) {
                setToggleContainer((previousState) => !previousState)
            }
        }}>
            {type === 'team' ? <ChannelPreview /> : <DirectPreview />}
            
        </div>
    )
}

export default TeamChannelPreview
