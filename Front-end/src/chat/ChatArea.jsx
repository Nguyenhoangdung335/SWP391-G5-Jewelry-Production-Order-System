import React, { useState } from 'react';

const ChatArea = React.forwardRef(({ messages, userId, handleImageUpload }, ref) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState("");

    React.useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, [messages]);

    const handleImageClick = (imageSrc) => {
        setModalImage(imageSrc);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const isImageUrl = (url) => {
        return url.endsWith("alt=media");
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            handleImageUpload({ target: { files } });
        }
        ref.current.classList.remove('drag-over');
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        ref.current.classList.add('drag-over');
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        ref.current.classList.remove('drag-over');
    };

    return (
        <div className="chat-area hidden" id="chat-messages" ref={ref}
             onDrop={handleDrop}
             onDragOver={handleDragOver}
             onDragLeave={handleDragLeave}>
            {messages.map((message, index) => (
                <div key={index} className={`message ${message.senderId === userId ? 'sender' : 'receiver'}`}>
                    {message.content.startsWith('https://') ? (
                        isImageUrl(message.content) ? (
                            <img
                                src={message.content}
                                alt="Uploaded"
                                className="uploaded-image img-fluid"
                                onClick={() => handleImageClick(message.content)}
                            />
                        ) : (
                            <a href={message.content} target="_blank" rel="noopener noreferrer">
                                {message.content}
                            </a>
                        )
                    ) : (
                        <p>{message.content}</p>
                    )}
                </div>
            ))}
            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content">
                        <img 
                            src={modalImage}
                            alt="Enlarged"
                            className="modal-image"
                            onClick={(e) => e.stopPropagation()}/>
                    </div>
                </div>
            )}
        </div>
    );
});

export default ChatArea;