interface InfoRowProps {
  label: string;
  value: string | number;
  icon?: string;
}

export function InfoRow({ label, value, icon }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center gap-2">
        {icon && <span>{icon}</span>}
        <span className="font-medium text-gray-700">{label}</span>
      </div>
      <span className="text-gray-600">{value}</span>
    </div>
  );
}