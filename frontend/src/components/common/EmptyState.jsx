import Button from './Button';

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction, actionIcon }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center py-16">
      {Icon && (
        <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {description && <p className="mt-2 text-gray-500 max-w-sm mx-auto">{description}</p>}
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction} icon={actionIcon}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}