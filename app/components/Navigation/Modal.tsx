interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
  }
  
  const Modal: React.FC<ModalProps> = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;
  
    return (
        <>
<dialog className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-10 z-50 overflow-auto backdrop-blur-sm flex flex-col justify-center items-center">
  <div className="bg-white m-auto rounded-xl border-2 border-gray-100 p-8 relative">
    <span className="absolute mt-0 pt-0 top-0 px-2 right-2 text-black cursor-pointer text-4xl" onClick={onClose}>
      &times;
    </span>
    <h2 className="absolute top-2 left-2 text-lg text-black font-bold">Informacija</h2>
    <div className="flex flex-col items-center mt-3">
      <h3>{message}</h3>
    </div>
  </div>
</dialog>
        </>
    );
  };
  
  export default Modal;