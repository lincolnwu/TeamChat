import React, { useEffect, useState } from 'react';
import { Avatar, useChatContext} from 'stream-chat-react';
import { List } from 'stream-chat-react/dist/components/AutoCompleteTextarea/List';

import { InviteIcon } from '../assets';

// whatever components rendered here will be populated in the children prop
const ListContainer = ({ children }) => {
    return (
        <div className="user-list__container">
            <div className="user-list__header">
                <p>User</p>
                <p>Invite</p>
            </div>
            {children}
        </div>
    )
}

const UserItem = ({ user, setSelectedUsers }) => {

    // toggle for checkbox
    const [selected, setSelected] = useState(false);

    const handleSelect = () => {
        // check if user has been selected and filter it out (if we have 3, select 3, unselect last one, first 2 remain)
        if (selected) {
            setSelectedUsers((previousUsers) => previousUsers.filter((previousUsers) => previousUsers !== user.id))
        } else {
            // add new user
            setSelectedUsers((previousUsers) => [...previousUsers, user.id])
        }

        setSelected((previousSelected) => !previousSelected)
    }

    return (
        <div className="user-item__wrapper" onClick={handleSelect}>
            <div className="user-item__name-wrapper">
                <Avatar image={user.image} name={user.fullName || user.id} size={32}/>
                <p className="user-item__name">{user.fullName || user.id}</p>
            </div>
            {selected ? <InviteIcon /> :<div className="user-item__invite-empty" /> }
        </div>
    )
}

const UserList = ({ setSelectedUsers }) => {
    // get client
    const { client } = useChatContext();

    // get all users
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false);

    const [listEmpty, setListEmpty] = useState(false);

    // error handling
    const [error, setError] = useState(false);

    // when something changes
    useEffect(() => {
        const getUsers = async () => {
            // first check if we're loading something
            // don't want to get users if we're loading something
            if(loading) return;

            // if we're not loading something set it to true
            // since we want to get users to enable the loading
            setLoading(true)

            try {
                // query all the users based on specific parameters
                const response = await client.queryUsers(
                    // exclude the querying of users for the user of the current id
                    // we don't want to find ourselves there, since we're the one adding users to the channel
                    // $ne = not equals to
                    { id: { $ne: client.userID} },
                    { id : 1}, // sort
                    //{ limit: 8}, // limit to 8 users
                )

                // check if we have anything in response
                if (response.users.length) {
                    setUsers(response.users)
                } else {
                    setListEmpty(true);
                }

            } catch (error) {
                console.log(error) // problem querying users
                setError(true)
            }
            setLoading(false);
        } 

        // call the function to get users
        // if there is a client (if we're connected), then we should call the function
        if (client) getUsers();

    }, [])

    // possible error conditions to not render
    if (error) {
        return (
            <ListContainer>
                <div className="user-list__message">
                    Error loading. Please refresh and try again.
                </div>
            </ListContainer>
        )
    }

    if (listEmpty) {
        return (
            <ListContainer>
                <div className="user-list__message">
                    No users found!
                </div>
            </ListContainer>
        )
    }

    return (
        <ListContainer>
            {loading ? <div className="user-list__message">
                Loading Users...
            </div> : (
                users?.map((user, index) => (
                    <UserItem index={index} key={users.id} user={user} setSelectedUsers={setSelectedUsers}/>
                )
            ))}
        </ListContainer>
    )
}

export default UserList