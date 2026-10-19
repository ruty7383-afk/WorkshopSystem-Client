import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

function WorkshopRegistrations() {
  const [workshops, setWorkshops] = useState([]);
  const [workshopId, setWorkshopId] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWorkshops = async () => {
      try {
        const response = await apiClient.get(
          "/api/workshops",
          {
            params: {
              page: 1,
              pageSize: 100,
              sortBy: "name",
              sortDirection: "asc",
            },
          }
        );

        setWorkshops(response.data.items ?? []);
      } catch (err) {
        setError(
          err.response?.data?.message ??
          "לא ניתן לטעון את רשימת הסדנאות"
        );
      }
    };

    loadWorkshops();
  }, []);

  const loadRegistrations = async (e) => {
    e.preventDefault();
    setError("");
    setRegistrations([]);

    try {
      const response = await apiClient.get(
        `/api/workshops/${workshopId}/registrations`
      );

      setRegistrations(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ??
        "לא ניתן לטעון את הנרשמים"
      );
    }
  };

  const statusText = (status) =>
    status === 0 ||
    status === "Active" ||
    status === "active"
      ? "פעילה"
      : "בוטלה";

  return (
    <div className="page">
      <h1>נרשמים לסדנאות</h1>

      <form
        className="filters"
        onSubmit={loadRegistrations}
      >
        <select
          value={workshopId}
          onChange={(e) =>
            setWorkshopId(e.target.value)
          }
          required
        >
          <option value="">
            בחרי סדנה
          </option>

          {workshops.map((workshop) => (
            <option
              key={workshop.id}
              value={workshop.id}
            >
              {workshop.name}
            </option>
          ))}
        </select>

        <button type="submit">
          הצגת נרשמים
        </button>
      </form>

      {error && (
        <p className="error">{error}</p>
      )}

      {workshopId &&
        registrations.length === 0 &&
        !error && (
          <p>לא נמצאו הרשמות לסדנה זו.</p>
        )}

      {registrations.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>שם</th>
              <th>אימייל</th>
              <th>סטטוס</th>
              <th>סכום ששולם</th>
              <th>החזר</th>
            </tr>
          </thead>

          <tbody>
            {registrations.map((r) => (
              <tr key={r.id ?? r.registrationId}>
                <td>
                  {r.userName ??
                    r.user?.name ??
                    r.name}
                </td>

                <td>
                  {r.email ??
                    r.userEmail ??
                    r.user?.email}
                </td>

                <td>
                  {statusText(r.status)}
                </td>

                <td>
                  ₪{r.amountPaid}
                </td>

                <td>
                  ₪{r.refundedAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default WorkshopRegistrations;
