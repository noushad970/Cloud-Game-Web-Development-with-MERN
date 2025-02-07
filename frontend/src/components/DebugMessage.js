import React, { useState, useEffect } from 'react';

const DebugMessage = ({ message }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), 4000);
        return () => clearTimeout(timer);
    }, []);

    return visible ? <div className="debug-message">{message}</div> : null;
};

export default DebugMessage;