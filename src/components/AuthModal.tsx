// AuthModal.tsx
import { useState } from 'react';

interface AuthModalProps {
  onConfirm: (password: string) => void;
  onClose: () => void;
}

export function AuthModal({ onConfirm, onClose }: AuthModalProps) {
  const [password, setPassword] = useState('');

  const handleConfirm = () => {
    onConfirm(password);
    setPassword(''); // Clear password field after confirming
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-80">
        <h2 className="text-lg font-semibold mb-4">Enter Password</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-md mb-4"
          placeholder="Enter password"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="text-gray-500">Cancel</button>
          <button
            onClick={handleConfirm}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
