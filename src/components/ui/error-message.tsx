interface ErrorMessageProps {
  message?: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null;
  return <p className="text-red-400 text-sm">{message}</p>;
};
