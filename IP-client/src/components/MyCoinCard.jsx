import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { baseURLApi } from "../helpers/http-client";
import { useState } from "react";

function MyCoinCard({ data, onUpdate, onDelete }) {
  const navigate = useNavigate();

  const handleUpdate = async (coinId) => {
    try {
      navigate(`/update-my-coin/${coinId}`);
    } catch (error) {
      console.log("🚀 ~ handleAdd ~ error:", error);
    }
  };

  const handleDelete = async (coinId) => {
    try {
      const response = await baseURLApi.delete(`/usercoins/${coinId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (response.status === 200) {
        toast.success("User coin successfully deleted");
        onDelete(coinId);
      }
    } catch (error) {
      console.log("🚀 ~ handleDelete ~ error:", error);
      if (error.status === 404) {
        toast.error(error.response?.data?.message || "User coin not found");
      }
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
        <Card.Text>qty: {data.quantity}</Card.Text>
        <Card.Text>{data.description}</Card.Text>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            // className="position-absolute bottom-0 end-50"
            variant="primary"
            style={{ flex: 1 }}
            onClick={() => handleUpdate(data.id)}
          >
            Update
          </Button>
          <Button
            // className="position-absolute bottom-0 end-50"
            variant="primary"
            style={{ flex: 1 }}
            onClick={() => handleDelete(data.id)}
          >
            Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default MyCoinCard;
