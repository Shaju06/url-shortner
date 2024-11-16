const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-75 z-50">
      <div className="loader border-8 border-gray-100 border-t-8 border-t-blue-500 rounded-full w-16 h-16 animate-spin"></div>
    </div>
  );
};

export default Loader;
