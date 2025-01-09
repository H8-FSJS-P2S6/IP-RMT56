import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { baseURLApi } from "../helpers/http-client";

function CoinCard({ data, onAdd }) {
  const navigate = useNavigate();
  //   console.log("🚀 ~ CoinCard ~ data:", data);
  const handleAdd = async (coinId) => {
    console.log("🚀 ~ handleAdd ~ coinId:", coinId);
    try {
      const response = await baseURLApi.post(
        `/usercoins/${coinId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (response.status === 201) {
        toast.success("The selected coin is added to MyCoins");
        navigate("/my-coins");
      }
    } catch (error) {
      console.log("🚀 ~ handleAdd ~ error:", error);
      if (error.status === 404) {
        toast.error(error.response?.data?.message || "Coin not found");
      }
      if (error.status === 400) {
        toast.error(
          error.response?.data?.message || "You cannot add same token"
        );
      }
      toast.error(error.response?.data?.message);
    }
  };
  return (
    <Card style={{ width: "18rem", height: "30rem" }}>
      <Card.Img
        variant="top"
        src={data.logo}
        style={{
          width: "50px",
          height: "50px",
          alignSelf: "center",
          backgroundColor: "#f3f3f3",
        }}
      />
      <Card.Body>
        <Card.Title>{data.symbol}</Card.Title>
        <Card.Title>{data.name}</Card.Title>
        <Card.Text>{data.description}</Card.Text>
        <div>
          <Button
            // className="position-absolute bottom-0 end-50"
            variant="primary"
            onClick={() => handleAdd(data.id)}
          >
            Add
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CoinCard;
