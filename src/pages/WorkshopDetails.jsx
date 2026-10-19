import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiClient from "../api/apiClient";
import { getRole, isLoggedIn } from "../utils/auth";

function WorkshopDetails() {
  const { id } = useParams();

  const [workshop, setWorkshop] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const statusText = (status) => {
    if (status === "Upcoming") return "טרם התחילה";
    if (status === "Started") return "התחילה";
    if (status === "Finished") return "הסתיימה";
    return status;
  };

  const loadWorkshop = async () => {
    try {
      const response = await apiClient.get(
        `/api/workshops/${id}`
      );

      setWorkshop(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ??
        "הסדנה לא נמצאה"
      );
    }
  };

  useEffect(() => {
    loadWorkshop();
  }, [id]);

  const register = async () => {
    try {
      setMessage("");
      setError("");

      await apiClient.post(
        `/api/workshops/${id}/registrations`
      );

      setMessage("נרשמת לסדנה בהצלחה");
      await loadWorkshop();
    } catch (err) {
      setError(
        err.response?.data?.message ??
        "ההרשמה לסדנה נכשלה"
      );
    }
  };

  if (!workshop) {
    return (
      <div className="page">
        {error || "טוען..."}
      </div>
    );
  }

  return (
    <div className="page narrow">
      <h1>{workshop.name}</h1>

      <p>{workshop.description}</p>
      <p>קטגוריה: {workshop.categoryName}</p>

      <p>
        תאריך התחלה:{" "}
        {new Date(
          workshop.startDate
        ).toLocaleDateString("he-IL")}
      </p>

      <p>שעת התחלה: {workshop.startTime}</p>
      <p>משך מפגש: {workshop.durationMinutes} דקות</p>
      <p>מספר מפגשים: {workshop.numberOfMeetings}</p>
      <p>מחיר: ₪{workshop.price}</p>
      <p>מספר מקומות: {workshop.capacity}</p>
      <p>מקומות פנויים: {workshop.availablePlaces}</p>
      <p>סטטוס: {statusText(workshop.status)}</p>

      {!isLoggedIn() && (
        <p>
          <Link to="/login">
            יש להתחבר כדי להירשם
          </Link>
        </p>
      )}

      {getRole() === "User" && (
        <button
          onClick={register}
          disabled={
            workshop.availablePlaces <= 0 ||
            workshop.status !== "Upcoming"
          }
        >
          הרשמה ותשלום
        </button>
      )}

      {message && (
        <p className="success">{message}</p>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default WorkshopDetails;
