import React, { useState } from 'react';

const ChatArea = React.forwardRef(({ messages, userId }, ref) => {
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

    return (
        <div className="chat-area hidden" id="chat-messages" ref={ref}>
            {messages.map((message, index) => (
                <div key={index} className={`message ${message.senderId === userId ? 'sender' : 'receiver'}`}>
                    {message.content.startsWith('https://') ? (
                        <img
                            src={message.content}
                            alt="Uploaded"
                            className="uploaded-image img-fluid"
                            onClick={() => handleImageClick(message.content)}
                        />
                    ) : (
                        <p>{message.content}</p>
                    )}
                </div>
            ))}
            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <img src={modalImage} alt="Enlarged" className="modal-image" />
                        <button className="close-button" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
});

export default ChatArea;