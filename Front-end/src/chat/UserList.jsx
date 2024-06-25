import React from 'react';

const UserList = React.memo(({ users, onSelectUser }) => {
    return (
        <ul id="connectedUsers">
            {users.length === 0 ? (
                <p>No users connected</p>
            ) : (
                users.map(user => (
                    <li key={user.id} className="user-item" id={user.id} onClick={(event) => onSelectUser(event)}>
                        <img src="../img/user_icon.png" alt={user.id} />
                        <span>{user.name}</span>
                        <span className="nbr-msg hidden">0</span>
                    </li>
                ))
            )}
        </ul>
    );
});

export default UserList;
