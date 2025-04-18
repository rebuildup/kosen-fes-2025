import { useParams } from "react-router-dom";

const Detail = () => {
  const { type, id } = useParams<{ type: string; id: string }>();

  return (
    <div>
      <h2>Details</h2>
      <p>Type: {type}</p>
      <p>ID: {id}</p>
    </div>
  );
};

export default Detail;
