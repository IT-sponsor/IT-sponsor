import React from 'react';

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold">{title}</h2>
                <p>{message}</p>
                <div className="mt-4 flex justify-between w-full">
                    <button 
                        onClick={onClose} 
                        className="py-2 px-4 rounded-lg text-black bg-gray-300 hover:bg-gray-400 transition duration-150 ease-in-out"
                    >
                        Atšaukti
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="py-2 px-4 rounded-lg text-black bg-[#C14040] hover:bg-red-700 transition duration-150 ease-in-out"
                    >
                        Patvirtinti
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;
