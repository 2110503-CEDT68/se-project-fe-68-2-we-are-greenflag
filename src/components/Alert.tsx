import { useEffect } from 'react';

type AlertProps = {
  message: string;
  type?: 'success' | 'error' | 'warning';
  onClose?: () => void;
};

export default function Alert({ message, type = 'success', onClose }: AlertProps) {

useEffect(() => {
  if (!onClose) return;
  const timer = setTimeout(() => onClose(), 3000);
  return () => clearTimeout(timer);
}, [onClose]);


  const styles = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
  };

  return (
    <div className="fixed top-5 right-5 z-50 animate-slide-in">
      <div className={`flex items-center justify-between gap-3 border px-4 py-3 rounded-xl shadow-lg ${styles[type]}`}>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>{icons[type]}</span>
          <span>{message}</span>
        </div>

        {onClose && (
          <button onClick={onClose} className="text-sm opacity-70 hover:opacity-100">
            ✕
          </button>
        )}
      </div>
    </div>
  );
}