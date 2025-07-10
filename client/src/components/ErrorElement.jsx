import { useRouteError, Link } from "react-router-dom";

const ErrorElement = () => {
  const error = useRouteError();
  console.log(error);

  return (
    <h4 className="font-bold text-4xl">
      {error.data?.msg || "There was an error, please try again."}
      <Link to="/login">Try logging in again</Link>
    </h4>
  );
};

export default ErrorElement;
