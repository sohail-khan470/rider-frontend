// src/components/drivers/DriverStatusBadge.tsx
interface DriverStatusBadgeProps {
  status: string;
}

const DriverStatusBadge = ({ status }: DriverStatusBadgeProps) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";

  switch (status) {
    case "online":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      break;
    case "offline":
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
      break;
    case "on_trip":
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      break;
    default:
      break;
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

export default DriverStatusBadge;
