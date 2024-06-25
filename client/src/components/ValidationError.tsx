const ValidationError = ({ message }: { message: string }) => {
  return <span className="text-sm text-red-400">{message}</span>;
};

export default ValidationError;
