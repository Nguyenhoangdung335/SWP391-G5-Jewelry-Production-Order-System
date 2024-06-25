import React, { useCallback } from 'react';

const MessageForm = React.forwardRef(({ sendMessage, handleImageUpload, messageInputRef, imageInputRef }, ref) => {
    const onSubmit = useCallback((event) => {
        event.preventDefault();
        if (messageInputRef.current && messageInputRef.current.value.trim()) {
            sendMessage(messageInputRef.current.value.trim());
            messageInputRef.current.value = '';
        }
    }, [sendMessage, messageInputRef]);

    return (
        <form ref={ref} onSubmit={onSubmit} id="messageForm" name="messageForm" className="hidden">
            <div className="message-input">
                <input
                    autoComplete="off"
                    type="text"
                    id="message"
                    placeholder="Type your message..."
                    ref={messageInputRef}
                />
                <input onChange={handleImageUpload} type="file" id="imageInput" accept="image/*" ref={imageInputRef} />
                <button type="submit">Send</button>
            </div>
        </form>
    );
});

export default MessageForm;
