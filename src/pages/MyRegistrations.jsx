import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const response = await apiClient.get(
        "/api/users/me/registrations"
      );

      setRegistrations(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ??
        "לא ניתן לטעון את ההרשמות"
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (workshopId) => {
    if (!window.confirm("האם לבטל את ההרשמה?")) {
      return;
    }

    try {
      setError("");

      await apiClient.delete(
        `/api/workshops/${workshopId}/registrations/me`
      );

      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ??
        "ביטול ההרשמה נכשל"
      );
    }
  };

  const isActive = (status) =>
    status === 0 ||
    status === "Active" ||
    status === "active";

  return (
    <div className="page">
      <h1>ההרשמות שלי</h1>

      {error && <p className="error">{error}</p>}

      <div className="cards">
        {registrations.map((registration) => (
          <article
            className="card"
            key={registration.id}
          >
            <h2>{registration.workshopName}</h2>

            <p>
              סכום ששולם: ₪{registration.amountPaid}
            </p>

            <p>
              סטטוס:{" "}
              {isActive(registration.status)
                ? "פעילה"
                : "בוטלה"}
            </p>

            <p>
              סכום שהוחזר: ₪{registration.refundedAmount}
            </p>

            {registration.cancelledAtUtc && (
              <p>
                תאריך ביטול:{" "}
                {new Date(
                  registration.cancelledAtUtc
                ).toLocaleString("he-IL")}
              </p>
            )}

            {isActive(registration.status) && (
              <button
                onClick={() =>
                  cancel(registration.workshopId)
                }
              >
                ביטול הרשמה
              </button>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

export default MyRegistrations;
