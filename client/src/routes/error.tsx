interface children {
  message: string;
  description?: string;
}

const ErrorPage: React.FC<children> = ({ message, description }: children) => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 text-center"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h3>{message}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default ErrorPage;
