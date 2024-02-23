import { useEffect, RefObject } from "react";

const useOutsideClick = <T extends HTMLElement>(
  ref: RefObject<T>,
  callback: () => void,
) => {
  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      handleClickOutside(event);
    };

    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [ref, callback]);
};

export default useOutsideClick;

// import React, { useRef } from 'react';
// import useOutsideClick from './useOutsideClick';

// const Modal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
//   const modalRef = useRef<HTMLDivElement>(null);

//   useOutsideClick(modalRef, onClose);

//   return (
//     <div className="modal" ref={modalRef}>
//       {/* Modal content */}
//     </div>
//   );
// };

// export default Modal;
