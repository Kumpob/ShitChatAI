import React, { useEffect, useState } from 'react';

const CustomToast = ({ message, color, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-in + fade-in
    setVisible(true);

    // Start slide-out + fade-out after 1 second
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 1000);

    // Remove from DOM after animation
    const removeTimer = setTimeout(() => {
      onClose();
    }, 1300); // duration should match transition time

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [onClose]);

  return (
    <div
      className={`
        fixed top-[20px] left-1/2 transform -translate-x-1/2 
        ${color} text-white px-4 py-2 rounded z-50
        transition-all duration-300 ease-in-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
      `}
    >
      {message}
    </div>
  );
};

export default CustomToast;
