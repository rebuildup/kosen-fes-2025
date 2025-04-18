import { useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();

  return (
    <div>
      <h2>Error</h2>
      <p>Something went wrong.</p>
      <p>{error?.toString()}</p>
    </div>
  );
};

export default Error;
