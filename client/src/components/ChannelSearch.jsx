import React, { useState, useEffect} from 'react'
import { useChatContext } from 'stream-chat-react';

import { ResultsDropdown } from './'
import { SearchIcon } from '../assets';

const ChannelSearch = ({ setToggleContainer }) => {

    // get info about current active channel
    const { client, setActiveChannel } = useChatContext();

    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    // get team and DM channels
    const [teamChannels, setTeamChannels] = useState([])
    const [directChannels, setDirectChannels] = useState([])

    // make sure to add dependency array at the end
    // call the fnction everytime the query CHANGES
    useEffect(() => {
        // if there is no query, clear the team and direct channels
        if (!query) {
            setTeamChannels([])
            setDirectChannels([])
        }
    }, [query]) // dependency array ensures that useEffect only runs if query changes


    // has to wait for the channels to be fetched
    const getChannels = async(textSearch) => {
        try {
            // query channels
            const channelResponse = client.queryChannels({
                //auto complete all usernames
                type: 'team', 
                name: { $autocomplete: textSearch }, 
                members: { $in: [client.userID] } // members includes our own user ID
            })
            const userResponse = client.queryUsers({
                id: { $ne: client.userID }, // exclude our own name
                name: { $autocomplete: textSearch } 
            })
            
            // get channels and users at the same time using Promise.all()
            // better than using two await b/c both of these requests start simultaneously
            // get channelResponse and userResponse back
            const [channels, { users }] = await Promise.all([ channelResponse, userResponse])

            // check if any channels exist
            if (channels.length) setTeamChannels(channels)

            // check if any users exist
            if (users.length) setDirectChannels(users)

        } catch (error) {
            setQuery('')
        }
    }


    const onSearch = (event) => {
        event.preventDefault(); // prevent page reload after submission
        setLoading(true);
        setQuery(event.target.value);

        // get chat channels
        getChannels(event.target.value);
    }

    // once we set the channel, we want to reset the query to be blank
    const setChannel = (channel) => {
        setQuery('')
        setActiveChannel(channel)
    }

    return (
        <div className="channel-search__container">
            <div className="channel-search__input__wrapper">
                <div className="channel-search__input__icon">
                    <SearchIcon />
                </div>
                <input 
                    className="channel-search__input__text" 
                    placeholder="Search" 
                    type="text" 
                    value={query}
                    onChange={onSearch}
                />
            </div>
            {/* If there exists a query in the search bar, render a dropdown menu component */}
            {query && (
                <ResultsDropdown
                    teamChannels={teamChannels}
                    directChannels={directChannels}
                    loading={loading}
                    setChannel={setChannel}
                    setQuery={setQuery}
                    setToggleContainer={setToggleContainer}
                />
            )}
        </div>
    )
}

export default ChannelSearch
