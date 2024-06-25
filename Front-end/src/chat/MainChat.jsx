import React, { useState, useEffect, useRef, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import UserList from './UserList';
import ChatArea from './ChatArea';
import MessageForm from './MessageForm';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    // other default options like headers, etc.
});

const ChatComponent = () => {
    const [stompClient, setStompClient] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userSaleStaff, setUserSaleStaff] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [messages, setMessages] = useState([]);

    const selectedUserIdRef = useRef(null);

    const usernamePageRef = useRef(null);
    const chatPageRef = useRef(null);
    const usernameFormRef = useRef(null);
    const messageFormRef = useRef(null);
    const messageInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const chatAreaRef = useRef(null);
    const roleSelectListRef = useRef(null);
    const roleSelectRef = useRef(null);

    useEffect(() => {

        window.addEventListener('beforeunload', onLogout);

        return () => {
            window.removeEventListener('beforeunload', onLogout);

            if (stompClient) {
                stompClient.publish({
                    destination: "/app/user.disconnectUser",
                    body: JSON.stringify({ id: userId }),
                });
                stompClient.deactivate();
            }
        };
    }, [stompClient, userId]);

    useEffect(() => {
        if (stompClient) {
            stompClient.onConnect = onConnected;
            stompClient.onStompError = onError;
            stompClient.activate();
        }
    }, [onConnected, stompClient]);

    useEffect(() => {
        selectedUserIdRef.current = selectedUserId;
        if (selectedUserId !== null) {
            fetchAndDisplayUserChat();
        }
    }, [selectedUserId]);

    const connect = useCallback(async (event) => {
        event.preventDefault();
        const enteredUserId = usernameFormRef.current.querySelector('#id').value.trim();
        if (!enteredUserId) {
            alert('Please enter a user ID.');
            return;
        }
        try {
            const [saleStaffResponse, userResponse] = await Promise.all([
                axiosInstance.get(`/${enteredUserId}/sale-staff`),
                axiosInstance.get(`/user/check/${enteredUserId}`)
            ]);
            setUserSaleStaff(saleStaffResponse.data);
            setCurrentUser(userResponse.data);
            setUserId(userResponse.data.id);
            onUserFound(userResponse.data);
        } catch (error) {
            handleConnectError(error);
        }
    }, []);

    const onUserFound = useCallback(() => {
        usernamePageRef.current.classList.add('hidden');
        chatPageRef.current.classList.remove('hidden');

        const socket = new SockJS('http://localhost:8083/ws', null, { withCredentials: true });
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: onConnected,
            onStompError: onError,
        });
        setStompClient(client);
        client.activate();
    }, []);

    async function onConnected() {
        console.log('Connected to WebSocket');
        console.log('stompClient value:', stompClient);

        if (stompClient) {
            // Subscribe to necessary channels
            stompClient.subscribe(`/user/${userId}/queue/messages`, onMessageReceived);
            stompClient.subscribe(`/topic/public`, onMessageReceived);

            // Perform operations that depend on stompClient being ready
            document.querySelector('#connected-user-fullname').textContent = currentUser.name;
            await findAndDisplayConnectedUsers();
            await fetchUnreadMessages();
        } else {
            console.error('stompClient is null in onConnected. WebSocket connection may not be properly established.');
        }
    }

    async function fetchUnreadMessages() {
        try {
            const unreadMessagesResponse = await axiosInstance.get(`/unread-messages/${userId}`);
            const unreadMessages = unreadMessagesResponse.data;
            if (unreadMessages && unreadMessages.length > 0) {
                unreadMessages.forEach(message => {
                    const notifiedUser = document.querySelector(`#${message.senderId}`);
                    if (notifiedUser) {
                        const nbrMsg = notifiedUser.querySelector('.nbr-msg');
                        if (nbrMsg) {
                            nbrMsg.classList.remove('hidden');
                            nbrMsg.textContent = parseInt(nbrMsg.textContent) + 1;
                        }
                    }
                });
            } else {
                console.log('No unread messages found.');
            }
        } catch (error) {
            if (error.response && error.response.status === 204) {
                console.log('No content found for unread messages.');
            } else {
                console.error('Failed to fetch unread messages:', error.message);
            }
        }
    }

    async function findAndDisplayConnectedUsers() {
        if (currentUser) {
            try {
                if (currentUser.role === "CUSTOMER") {
                    roleSelectListRef.current.classList.add('hidden');
                    if (userSaleStaff !== "") {
                        const response = await axiosInstance.get(`/user/check/${userSaleStaff}`);
                        const user = response.data;
                        await renderConnectedUsers([user]);
                    }
                } else {
                    roleSelectListRef.current.classList.remove('hidden');
                    const response = await axiosInstance.get(`/users/${roleSelectRef.current.value}`);
                    const users = response.data;
                    await renderConnectedUsers(users.filter(user => user.id !== userId));
                }
            } catch (error) {
                console.error('Error fetching and displaying connected users:', error);
            }
        }
    }

    function renderConnectedUsers(users) {
        setConnectedUsers(users);
    }

    const onRoleChange = useCallback(() => {
        findAndDisplayConnectedUsers().then(() => {
            chatAreaRef.current?.classList.add('hidden');
        });
    }, [findAndDisplayConnectedUsers]);

    function markMessagesAsRead(recipientId) {
        try {
            axiosInstance.post(`/mark-messages-as-read/${recipientId}`);
            console.log(`Messages for ${recipientId} marked as read.`);
        } catch (error) {
            console.error(`Failed to mark messages as read for ${recipientId}:`, error.message);
        }
    }

    function userItemClick(event) {
        document.querySelectorAll('.user-item').forEach(item => {
            item.classList.remove('active');
        });
        messageFormRef.current.classList.remove('hidden');

        const clickedUser = event.currentTarget;
        console.log("ClickedUser: ", clickedUser);
        clickedUser.classList.add('active');

        setSelectedUserId(clickedUser.getAttribute('id'));

        markMessagesAsRead(userId);

        const nbrMsg = clickedUser.querySelector('.nbr-msg');
        nbrMsg.classList.add('hidden');
        nbrMsg.textContent = '0';
    }

    function displayMessage(senderId, content) {
        try {
            if (!content) {
                console.warn('Content is empty or undefined. Skipping display.');
                return;
            }

            const messageContainer = document.createElement('div');
            messageContainer.classList.add('message');
            if (senderId === userId) {
                messageContainer.classList.add('sender');
            } else {
                messageContainer.classList.add('receiver');
            }

            let messageElement;
            if (typeof content === 'string' && content.startsWith('https://')) {
                messageElement = document.createElement('img');
                messageElement.src = content;
                messageElement.alt = 'Uploaded image';
                messageElement.classList.add('uploaded-image');
            } else {
                messageElement = document.createElement('p');
                messageElement.textContent = content;
            }

            messageContainer.appendChild(messageElement);
            if (chatAreaRef.current) {
                chatAreaRef.current.appendChild(messageContainer);
                chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
            } else {
                console.warn('chatAreaRef.current is null or undefined. Unable to append message.');
            }
        } catch (error) {
            console.error('Error displaying message:', error);
        }
    }

    async function fetchAndDisplayUserChat() {
        if (selectedUserId) {
            try {
                const response = await axiosInstance.get(`/messages/${userId}/${selectedUserId}`);
                const userChat = response.data;
                if (userChat) {
                    const formattedMessages = userChat.map(msg => ({
                        senderId: msg.senderId,
                        content: msg.content,
                        timestamp: msg.timestamp,
                    }));
                    setMessages(formattedMessages);
                } else {
                    setMessages([]); // Clear messages if no chat found
                    console.log('No chat messages found.');
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setMessages([]);
                    console.log('No chat messages found.');
                } else {
                    console.error('Failed to fetch user chat:', error.message);
                }
            }
        }
    }

    const onMessageReceived = useCallback((payload) => {
        const message = JSON.parse(payload.body);
        if (message.senderId === selectedUserIdRef.current || message.recipientId === userId) {
            setMessages(prevMessages => [...prevMessages, message]);
            chatAreaRef.current?.classList.remove('hidden');
        } else {
            const notifiedUser = document.getElementById(message.senderId);
            if (notifiedUser) {
                const nbrMsg = notifiedUser.querySelector('.nbr-msg');
                nbrMsg.classList.remove('hidden');
                nbrMsg.textContent = (parseInt(nbrMsg.textContent) || 0) + 1;
            }
        }
    }, [userId]);


    const sendMessage = useCallback(() => {
        const messageContent = messageInputRef.current.value.trim();
        if (messageContent && stompClient && stompClient.connected) {
            const chatMessage = {
                senderId: userId,
                recipientId: selectedUserIdRef.current,
                content: messageContent,
                timestamp: new Date(),
            };
            stompClient.publish({
                destination: "/app/chat",
                body: JSON.stringify(chatMessage),
            });
            console.log('Message sent:', chatMessage);
            messageInputRef.current.value = '';
            setMessages(prevMessages => [...prevMessages, chatMessage]);
        }
    }, [stompClient, userId, selectedUserId]);

    const handleImageUpload = async (event) => {
        const imageFile = event.target.files[0];
        if (imageFile) {
            try {
                const formData = new FormData();
                formData.append('senderId', userId);
                formData.append('recipientId', selectedUserIdRef.current);
                formData.append('message', messageInputRef.current.value);

                const resizedImageFile = await resizeImage(imageFile);
                formData.append('file', resizedImageFile);

                const response = await axios.post('http://localhost:8083/chat/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                const imageURL = response.data;
                const imageMessage = {
                    senderId: userId,
                    recipientId: selectedUserIdRef.current,
                    content: imageURL,
                    timestamp: new Date(),
                };
                setMessages(prevMessages => [...prevMessages, imageMessage]);

                messageInputRef.current.value = '';
                imageInputRef.current.value = '';
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Failed to upload image. Please try again later.');
            }
        }
    };

    const resizeImage = (imageFile) => {
        const maxSize = 1024;
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = function (event) {
                const img = new Image();
                img.src = event.target.result;
                img.onload = function () {
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxSize) {
                            height *= maxSize / width;
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width *= maxSize / height;
                            height = maxSize;
                        }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(new File([blob], imageFile.name, { type: imageFile.type }));
                    }, imageFile.type);
                };
            };
            reader.onerror = reject;
        });
    };

    function handleConnectError(error) {
        if (error.response) {
            if (error.response.status === 404) {
                alert('User not found. Please enter a valid user ID.');
            } else if (error.response.status === 500) {
                alert('Server error. Please try again later.');
            }
        } else {
            console.error('Error connecting user:', error.message);
            alert('Failed to connect user. Please try again later.');
        }
    }

    const onLogout = useCallback(() => {
        if (stompClient) {
            stompClient.publish({
                destination: "/app/user.disconnectUser",
                body: JSON.stringify({ id: userId }),
            });
            stompClient.deactivate();
        }
        setStompClient(null);
        setCurrentUser(null);
        setUserId(null);
        setUserSaleStaff(null);
        setSelectedUserId(null);
        setConnectedUsers([]);
        setMessages([]);
        usernamePageRef.current.classList.remove('hidden');
        chatPageRef.current.classList.add('hidden');
    }, [stompClient, userId]);

    const onError = useCallback((error) => {
        console.error('WebSocket error:', error.message);
    }, []);

    return (
        <div>
            <div ref={usernamePageRef} id="username-page">
                <div className="username-page-container">
                    <h1 className="title">Chat App</h1>
                    <form ref={usernameFormRef} name="usernameForm" onSubmit={connect}>
                        <div className="form-group">
                            <input type="text" id="id" placeholder="Enter your ID" autoComplete="off" className="form-control" required />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="accent username-submit">Start Chatting</button>
                        </div>
                    </form>
                </div>
            </div>

            <div ref={chatPageRef} id="chat-page" className="hidden">
                <div className="chat-container">
                    <div className="users-list">
                        <div className="users-list-container">

                        <div ref={roleSelectListRef} className="role-select-list hidden">
                            <select id="role-select" ref={roleSelectRef} onChange={onRoleChange}>
                                <option value="CUSTOMER">Customer</option>
                                <option value="STAFF">Staff</option>
                                <option value="MANAGER">Manager</option>
                            </select>
                        </div>
                        <UserList users={connectedUsers} onSelectUser={userItemClick}/>
                        </div>
                        <div>
                            <p id="connected-user-fullname"></p>
                            <button className="logout" onClick={onLogout}>Logout</button>
                        </div>
                    </div>
                    <div className="chat-area">
                    <ChatArea messages={messages}
                              ref={chatAreaRef}
                              userId={userId}
                    />
                        <MessageForm
                            ref={messageFormRef}
                            messageInputRef={messageInputRef}
                            sendMessage={sendMessage}
                            handleImageUpload={handleImageUpload}
                            imageInputRef={imageInputRef}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatComponent;
