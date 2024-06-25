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
            <div className="message-input d-flex">
                <input
                    autoComplete="off"
                    type="text"
                    id="message"
                    className="form-control me-2"
                    placeholder="Type your message..."
                    ref={messageInputRef}
                />
                <input onChange={handleImageUpload} type="file" id="imageInput" accept="image/*" ref={imageInputRef} className="form-control me-2" />
                <button type="submit" className="btn btn-primary">Send</button>
            </div>
        </form>
    );
});

export default MessageForm;