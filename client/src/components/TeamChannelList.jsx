import React from 'react'

import { AddChannel } from '../assets';

const TeamChannelList = ({ children, error = false, loading, type, isCreating, setIsCreating, setCreateType, setIsEditing, setToggleContainer }) => {
    // error msg
    if (error) {
        return type === 'team' ? (
            <div className="team-channel-list">
                <p className="team-channel-list__message">
                    Connection Error! Please wait a moment and try again.
                </p>
            </div>
        ) : null;
    }

    // loading bar
    if (loading) {
        return (
            <div className="team-channel-list">
                <p className="team-channel-list__loading">
                    {type === 'team' ? 'Channels' : 'Messages'} loading ...
                </p>
            </div>
        )
    }

    return (
        <div className="team-channel-list">
            <div className="team-channel-list__header">
                <p className="team-channel-list__header__title">
                {type === 'team' ? 'Channels' : 'Direct Messages'} 
                </p>
                {/* {Button to add Channel} */}
                <AddChannel 
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    setCreateType={setCreateType}
                    setIsEditing={setIsEditing}
                    type={type === 'team' ? 'team' : 'messaging'}
                    setToggleContainer={setToggleContainer}
                />
            </div>
            {children}
        </div>
    )
}

export default TeamChannelList
