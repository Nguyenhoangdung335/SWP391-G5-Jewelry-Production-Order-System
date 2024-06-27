import React, { useState, useEffect, useRef, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import UserList from './UserList';
import ChatArea from './ChatArea';
import MessageForm from './MessageForm';
import serverUrl from "../reusable/ServerUrl";
import './index.css'
import { useAuth } from "../provider/AuthProvider";
import { jwtDecode } from "jwt-decode";

const axiosInstance = axios.create({
    baseURL: serverUrl,
    // other default options like headers, etc.
});

const Chat = () => {
    const { token } = useAuth();
    const decodedToken = jwtDecode(token);

    const [stompClient, setStompClient] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userSaleStaff, setUserSaleStaff] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [tokens] = useState(decodedToken);

    const selectedUserIdRef = useRef(null);

    const chatPageRef = useRef(null);
    const messageFormRef = useRef(null);
    const messageInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const chatAreaRef = useRef(null);
    const roleSelectListRef = useRef(null);
    const roleSelectRef = useRef(null);

    useEffect(() => {
        if (tokens) {
            const user = {
                id: tokens.id,
                name: tokens.first_name,
                role: tokens.role,
                saleStaff: null,
            };

            setCurrentUser(user);
            setUserId(user.id);

            axiosInstance.get(`/${tokens.id}/sale-staff`)
                .then(response => {
                    const saleStaff = response.data;
                    setCurrentUser(prevUser => ({ ...prevUser, saleStaff }));
                    setUserSaleStaff(saleStaff);
                })
                .catch(error => {
                    console.error('Error fetching sale staff:', error);
                });

        }
        console.log(tokens);
    }, [tokens]);

    useEffect(() => {
        if (currentUser && currentUser.id && !stompClient) {
            initializeWebSocket();
        }
    }, [currentUser, stompClient]);

    const initializeWebSocket = () => {
        console.log('Initializing WebSocket...');
        const socket = new SockJS(serverUrl + '/ws', null, { withCredentials: true });
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('Connected to WebSocket');
                console.log('stompClient:', client); // Check client here
                console.log('currentUser:', currentUser); // Check currentUser here
                console.log('userId:', userId); // Check userId here

                client.subscribe(`/user/${userId}/queue/messages`, onMessageReceived);
                client.subscribe(`/topic/public`, onMessageReceived);

                const connectedUserFullnameElement = document.querySelector('#connected-user-fullname');
                if (connectedUserFullnameElement) {
                    connectedUserFullnameElement.textContent = currentUser.role + ": " + currentUser.name;
                } else {
                    console.warn("Element with ID 'connected-user-fullname' not found in the DOM.");
                }

                findAndDisplayConnectedUsers().then();
                fetchUnreadMessages().then();
            },
            onStompError: onError,
        });

        setStompClient(client); // Set stompClient state
        console.log('Setting stompClient...');
        client.activate(); // Activate WebSocket connection
        console.log('Activating WebSocket connection...');
    };

    useEffect(() => {
        return () => {
            if (stompClient) {
                stompClient.publish({
                    destination: "/app/user.disconnectUser",
                    body: JSON.stringify({ id: userId }),
                });
                stompClient.deactivate();
                setStompClient(null);
            }
        };
    }, [stompClient, userId]);

    const onError = useCallback((error) => {
        console.error('WebSocket error:', error.message);
    }, []);

    const fetchUnreadMessages = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/unread-messages/${userId}`);
            const unreadMessages = response.data;
            unreadMessages.forEach(message => {
                const notifiedUser = document.querySelector(`#${message.senderId}`);
                if (notifiedUser) {
                    const nbrMsg = notifiedUser.querySelector('.nbr-msg');
                    nbrMsg.classList.remove('hidden');
                    nbrMsg.textContent = (parseInt(nbrMsg.textContent) || 0) + 1;
                }
            });
        } catch (error) {
            if (error.response?.status === 204) {
                console.log('No unread messages found.');
            } else {
                console.error('Failed to fetch unread messages:', error.message);
            }
        }
    }, [userId]);

    const findAndDisplayConnectedUsers = useCallback(async () => {
        if (currentUser) {
            try {
                if (currentUser.role === "CUSTOMER") {
                    if (roleSelectListRef.current) {
                        roleSelectListRef.current.classList.add('hidden');
                    }
                    if (userSaleStaff) {  // Check if userSaleStaff is not null
                        const response = await axiosInstance.get(`/user/check/${userSaleStaff}`);
                        const user = response.data;
                        await renderConnectedUsers([user]);
                    }
                } else {
                    if (roleSelectListRef.current) {
                        roleSelectListRef.current.classList.remove('hidden');
                    }
                    const roleSelectValue = roleSelectRef.current ? roleSelectRef.current.value : null;
                    if (roleSelectValue) {
                        const response = await axiosInstance.get(`/users/${roleSelectValue}`);
                        const users = response.data;
                        await renderConnectedUsers(users.filter(user => user.id !== userId));
                    }
                }
            } catch (error) {
                console.error('Error fetching and displaying connected users:', error);
            }
        }
    }, [currentUser, userSaleStaff, userId, roleSelectRef]);

    const renderConnectedUsers = (users) => {
        setConnectedUsers(users);
    };

    const onRoleChange = useCallback(() => {
        findAndDisplayConnectedUsers().then(() => {
            chatAreaRef.current?.classList.add('hidden');
            fetchUnreadMessages().then();
        });
    }, [findAndDisplayConnectedUsers]);

    const markMessagesAsRead = useCallback(async (recipientId) => {
        try {
            await axiosInstance.post(`/mark-messages-as-read/${recipientId}`);
            console.log(`Messages for ${recipientId} marked as read.`);
        } catch (error) {
            console.error(`Failed to mark messages as read for ${recipientId}:`, error.message);
        }
    }, []);

    useEffect(() => {
        if (selectedUserId !== null) {
            fetchAndDisplayUserChat();
        }
    }, [selectedUserId]);

    const fetchAndDisplayUserChat = useCallback(async () => {
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
    }, [selectedUserId, userId]);

    const userItemClick = useCallback((event) => {
        document.querySelectorAll('.user-item').forEach(item => {
            item.classList.remove('active');
        });
        messageFormRef.current.classList.remove('hidden');

        const clickedUser = event.currentTarget;
        console.log("ClickedUser: ", clickedUser);
        clickedUser.classList.add('active');

        setSelectedUserId(clickedUser.getAttribute('id'));

        markMessagesAsRead(clickedUser.getAttribute('id'));

        const nbrMsg = clickedUser.querySelector('.nbr-msg');
        nbrMsg.classList.add('hidden');
        nbrMsg.textContent = '0';
    }, [markMessagesAsRead]);

    const sendMessage = useCallback(() => {
        const messageContent = messageInputRef.current.value.trim();
        if (messageContent && stompClient && stompClient.connected) {
            const chatMessage = {
                senderId: userId,
                recipientId: selectedUserId,
                content: messageContent,
                timestamp: new Date()
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
    }, [selectedUserIdRef, userId]);

    const handleImageUpload = async (event) => {
        const imageFile = event.target.files[0];
        if (imageFile) {
            try {
                const formData = new FormData();
                formData.append('senderId', userId);
                formData.append('recipientId', selectedUserId);
                formData.append('message', messageInputRef.current.value);

                const resizedImageFile = await resizeImage(imageFile);
                formData.append('file', resizedImageFile);

                const response = await axiosInstance.post('/chat/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                const imageURL = response.data;
                const imageMessage = {
                    senderId: userId,
                    recipientId: selectedUserId,
                    content: imageURL,
                    timestamp: new Date(),
                };
                setMessages(prevMessages => [...prevMessages, imageMessage]);

                messageInputRef.current.value = '';
                imageInputRef.current.value = '';
                console.log("Uploaded image: ", imageMessage);
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

    // const onLogout = useCallback(() => {
    //     setStompClient((prevClient) => {
    //         if (prevClient) {
    //             prevClient.publish({
    //                 destination: "/app/user.disconnectUser",
    //                 body: JSON.stringify({ id: userId }),
    //             });
    //             // Do not deactivate stompClient here, leave it active
    //         }
    //         return prevClient; // Return the unchanged stompClient
    //     });
    //
    //     setCurrentUser(null);
    //     setUserId(null);
    //     setUserSaleStaff(null);
    //     setSelectedUserId(null);
    //     setConnectedUsers([]);
    //     setMessages([]);
    // }, [userId]);

    // useEffect(() => {
    //     selectedUserIdRef.current = selectedUserId;
    //     if (selectedUserId !== null) {
    //         fetchAndDisplayUserChat();
    //     }
    // }, [selectedUserId]);

    return (
        <div className="container mt-5">
            <div ref={chatPageRef} id="chat-page">
                <div className="chat-container">
                    <div className="users-list">
                        <div className="users-list-container">
                            <div ref={roleSelectListRef} className="role-select-list hidden">
                                <select id="role-select" ref={roleSelectRef} onChange={onRoleChange} className="form-select mb-3">
                                    <option value="CUSTOMER">Customer</option>
                                    <option value="STAFF">Staff</option>
                                    <option value="MANAGER">Manager</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            <UserList users={connectedUsers}
                                onSelectUser={userItemClick}
                                currentUser={currentUser}
                            />
                        </div>
                        <div>
                            <p id="connected-user-fullname"></p>
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
};

export default Chat;
