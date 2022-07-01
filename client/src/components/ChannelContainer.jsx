import React from 'react';
import { Channel, useChatContext, MessageTeam} from 'stream-chat-react';

import { ChannelInner, CreateChannel, EditChannel} from './'; // from components

const ChannelContainer = ({ isCreating, setIsCreating, isEditing, setIsEditing, createType }) => {
    // get info about the current specific channel
    const { channel } = useChatContext();

    // if we're currently creating a new channel, show a dashboard for creating one
    if (isCreating) {
        return (
            <div className="channel__container">
                <CreateChannel createType={createType} setIsCreating={setIsCreating}/>
            </div>
        )
    }

    // if editing 
    if (isEditing) {
        return (
            <EditChannel setIsEditing={setIsEditing} setIsCreating={setIsCreating}/>  
        )
    }

    // create empty state for when a channel is created, with no messages yet
    const EmptyState = () => (
        <div className="channel-empty__container">
            <p className="channel-empty__first">This is the beginning of your chat history</p>
            <p className="channel-empty__second">Second messages, attachments, links, emojis, and more...</p>
        </div>
    )

    return (
        <div className="channel__container">
            <Channel
                EmptyStateIndicator={EmptyState}
                Message={(messageProps, index) => <MessageTeam key={index} {... messageProps} />}
            >
                <ChannelInner setIsEditing={setIsEditing}/>
            </Channel>
            
        </div>
    )
}

export default ChannelContainer