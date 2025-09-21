export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => onCancel()}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-600">{title}</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-2xl"
            onClick={() => onCancel()}
          >
            &times;
          </button>
        </div>

        <p className="text-gray-700 mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
            onClick={() => onCancel()}
          >
            Cancel
          </button>
          <button
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors"
            onClick={() => onConfirm()}
            autoFocus
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
