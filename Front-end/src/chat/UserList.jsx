import React from 'react';

const UserList = React.memo(({ users, onSelectUser, currentUser  }) => {
    return (
        <ul id="connectedUsers" className="list-group">
            {users.length === 0 ? (
                <p className="list-group-item">No users connected</p>
            ) : (
                users.map((user) => {
                    if (user.id === currentUser.id) {
                        return null;
                    }
                    return (
                        <li key={user.id} className="list-group-item user-item" id={user.id} onClick={(event) => onSelectUser(event)}>
                            <img src="../img/user_icon.png" alt={user.id} className="rounded-circle me-2" />
                            <span>{user.name}</span>
                            <span className="nbr-msg hidden">0</span>
                        </li>
                    );
                })
            )}
        </ul>
    );
});

export default UserList;