export const PROJECT_STATUSES = [
  { value: 'Backlog', label: 'Backlog', color: 'bg-[#E6E6E6] text-[#202020]' },
  { value: 'Not Started', label: 'Not Started', color: 'bg-[#E6E6E6] text-[#202020]' },
  { value: 'In Progress', label: 'In Progress', color: 'bg-[#DBEAFE] text-[#2984FE]' },
  { value: 'On Hold', label: 'On Hold', color: 'bg-[#FEF7DA] text-[#B45309]' },
  { value: 'Completed', label: 'Completed', color: 'bg-[#D7FDE3] text-[#15803D]' },
  { value: 'Cancelled', label: 'Cancelled', color: 'bg-[#FEE7D5] text-[#B91C1C]' },
];

export const getStatusStyle = (statusValue) => {
  const match = PROJECT_STATUSES.find((s) => s.value.toLowerCase() === statusValue?.toLowerCase());
  return match?.color || 'bg-gray-200 text-gray-600';
};

export const getStatusLabel = (statusValue) => {
  const match = PROJECT_STATUSES.find((s) => s.value.toLowerCase() === statusValue?.toLowerCase());
  return match?.label || statusValue || 'Not Set';
};
