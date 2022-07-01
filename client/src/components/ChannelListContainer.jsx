import React, { useState} from 'react';
import { ChannelList, useChatContext } from 'stream-chat-react';
import Cookies from 'universal-cookie';
import { ChannelSearch, TeamChannelList, TeamChannelPreview } from './';

import HomeIcon from '../assets/homeicon.png'
import LogoutIcon from '../assets/logout.png'

const cookies = new Cookies();

// the sidebar
const SideBar = ({ logout }) => (
    <div className="channel-list__sidebar">
        <div className="channel-list__sidebar__icon1">
            <div className="icon1__inner">
                <img src={HomeIcon} alt="Hospital" width="30" />
            </div>
        </div>

        <div className="channel-list__sidebar__icon2">
            <div className="icon1__inner" onClick={logout}>
                <img src={LogoutIcon} alt="Logout" width="30" />
            </div>
        </div>
    </div>
);

const CompanyHeader = () => (
    <div className="channel-list__header">
        <p className="channel-list__header__text">TeamChat</p>
    </div>
)

// filters for team channels so they appear on the side
const customChannelTeamFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'team') // only keep the channels that are teams
}

// filters for DMs
const customChannelMessagingFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'messaging') // only keep the channels for DMs
}

const ChannelListContent = ({ isCreating, setIsCreating, setCreateType, setIsEditing, setToggleContainer }) => {

    // get client to create filter objects
    const { client } = useChatContext();

    // clear cookies and reload window
    const logout = () => {
        cookies.remove("token");
        cookies.remove('userId');
        cookies.remove('username');
        cookies.remove('fullName');
        cookies.remove('avatarURL');
        cookies.remove('hashedPassword');
        cookies.remove('phoneNumber');

        // reload window
        window.location.reload();
    }

    // get all the channels where our user is included
    // where $in = included
    const filters = { members: { $in: [client.userID ]}}

    return (
        <>
            <SideBar logout={logout}/>
            <div className="channel-list__list__wrapper">
                <CompanyHeader />
                <ChannelSearch setToggleContainer={setToggleContainer}/>
                <ChannelList 
                    filters={ filters }
                    channelRenderFilterFn={customChannelTeamFilter}
                    List={(listProps) => (
                        <TeamChannelList  
                            {...listProps}
                            type="team"
                            isCreating={isCreating}
                            setIsCreating={setIsCreating}
                            setCreateType={setCreateType}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                        />
                    ) }
                    Preview={(previewProps) => (
                        <TeamChannelPreview
                            {...previewProps}
                            type="team"
                            setToggleContainer={setToggleContainer}
                            setIsCreating={setIsCreating}
                            setIsEditing={setIsEditing}
                        />
                    )}
                />
                <ChannelList 
                    filters={ filters }
                    channelRenderFilterFn={customChannelMessagingFilter}
                    List={(listProps) => (
                        <TeamChannelList  
                            {...listProps}
                            type="messaging"
                            isCreating={isCreating}
                            setIsCreating={setIsCreating}
                            setCreateType={setCreateType}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                        />
                    ) }
                    Preview={(previewProps) => (
                        <TeamChannelPreview
                            {...previewProps}
                            type="messaging"
                            setToggleContainer={setToggleContainer}
                            setIsCreating={setIsCreating}
                            setIsEditing={setIsEditing}
                        />
                    )}
                />
            </div>
        </>
    )
}

const ChannelListContainer = ({ setCreateType, setIsCreating, setIsEditing }) => {
    // toggle container based on width of the screen (ex: web, mobile)
    const [toggleContainer, setToggleContainer] = useState(false)
    return (
        <>
            <div className="channel-list__container">
                <ChannelListContent 
                    setIsCreating={setIsCreating}
                    setCreateType={setCreateType} 
                    setIsEditing={setIsEditing}
                />
            </div>

            <div className="channel-list__container-responsive"
                    style={{ left: toggleContainer ? "0%" : "-90%", backgroundColor: "#005fff" }}>
                <div className="channel-list__container-toggle" 
                    onClick={() => setToggleContainer((previousToggleContainer) => !previousToggleContainer)}>  
                    </div>
                <ChannelListContent 
                    setIsCreating={setIsCreating}
                    setCreateType={setCreateType} 
                    setIsEditing={setIsEditing}
                    setToggleContainer={setToggleContainer}
                />
            
            </div>
        </>
    )
}

export default ChannelListContainer