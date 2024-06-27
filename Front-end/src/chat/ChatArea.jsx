import React from 'react';

const ChatArea = React.forwardRef(({ messages, userId }, ref ) => {

    React.useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chat-area hidden" id="chat-messages" ref={ref}>
            {messages.map((message, index) => (
                <div key={index} className={`message ${message.senderId === userId ? 'sender' : 'receiver'}`}>
                    {message.content.startsWith('https://') ? (
                        <img src={message.content} alt="Uploaded" className="uploaded-image img-fluid" />
                    ) : (
                        <p>{message.content}</p>
                    )}
                </div>
            ))}
        </div>
    );
});

export default ChatArea;