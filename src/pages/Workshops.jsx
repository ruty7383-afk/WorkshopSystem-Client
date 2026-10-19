import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/apiClient";

function Workshops() {
  const [workshops, setWorkshops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [query, setQuery] = useState({
    search: "",
    categoryId: "",
    dayOfWeek: "",
    availability: "",
    status: "",
    sortBy: "startDate",
    sortDirection: "asc",
    pageSize: 6,
  });

  const [error, setError] = useState("");

  const statusText = (status) => {
    if (status === "Upcoming") return "טרם התחילה";
    if (status === "Started") return "התחילה";
    if (status === "Finished") return "הסתיימה";
    return status;
  };

  const loadCategories = async () => {
    try {
      const response = await apiClient.get("/api/categories");
      setCategories(response.data);
    } catch {
      setError("לא ניתן לטעון את הקטגוריות");
    }
  };

  const loadWorkshops = async () => {
    try {
      setError("");

      const params = {
        page,
        pageSize: query.pageSize,
      };

      Object.entries(query).forEach(([key, value]) => {
        if (
          key !== "pageSize" &&
          value !== "" &&
          value !== null
        ) {
          params[key] = value;
        }
      });

      const response = await apiClient.get(
        "/api/workshops",
        { params }
      );

      setWorkshops(response.data.items ?? []);
      setTotalPages(response.data.totalPages ?? 1);
    } catch (err) {
      setError(
        err.response?.data?.message ??
        "לא ניתן לטעון את הסדנאות"
      );
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadWorkshops();
  }, [page]);

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const search = (e) => {
    e.preventDefault();

    if (page !== 1) {
      setPage(1);
    } else {
      loadWorkshops();
    }
  };

  return (
    <div className="page">
      <h1>סדנאות</h1>

      <form className="filters" onSubmit={search}>
        <input
          name="search"
          placeholder="חיפוש לפי שם"
          value={query.search}
          onChange={handleChange}
        />

        <select
          name="categoryId"
          value={query.categoryId}
          onChange={handleChange}
        >
          <option value="">כל הקטגוריות</option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        <select
          name="dayOfWeek"
          value={query.dayOfWeek}
          onChange={handleChange}
        >
          <option value="">כל הימים</option>
          <option value="0">ראשון</option>
          <option value="1">שני</option>
          <option value="2">שלישי</option>
          <option value="3">רביעי</option>
          <option value="4">חמישי</option>
          <option value="5">שישי</option>
          <option value="6">שבת</option>
        </select>

        <select
          name="availability"
          value={query.availability}
          onChange={handleChange}
        >
          <option value="">כל הסדנאות</option>
          <option value="available">יש מקום</option>
          <option value="full">מלא</option>
        </select>

        <select
          name="status"
          value={query.status}
          onChange={handleChange}
        >
          <option value="">כל הסטטוסים</option>
          <option value="upcoming">טרם התחילה</option>
          <option value="started">התחילה</option>
          <option value="finished">הסתיימה</option>
        </select>

        <select
          name="sortBy"
          value={query.sortBy}
          onChange={handleChange}
        >
          <option value="startDate">תאריך התחלה</option>
          <option value="name">שם</option>
          <option value="price">מחיר</option>
          <option value="availablePlaces">
            מקומות פנויים
          </option>
        </select>

        <select
          name="sortDirection"
          value={query.sortDirection}
          onChange={handleChange}
        >
          <option value="asc">מהנמוך לגבוה</option>
          <option value="desc">מהגבוה לנמוך</option>
        </select>

        <button type="submit">חיפוש</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="cards">
        {workshops.map((workshop) => (
          <article className="card" key={workshop.id}>
            <h2>{workshop.name}</h2>

            <p>קטגוריה: {workshop.categoryName}</p>

            <p>
              תאריך:{" "}
              {new Date(
                workshop.startDate
              ).toLocaleDateString("he-IL")}
            </p>

            <p>שעה: {workshop.startTime}</p>
            <p>מחיר: ₪{workshop.price}</p>

            <p>
              מקומות פנויים: {workshop.availablePlaces}
            </p>

            <p>סטטוס: {statusText(workshop.status)}</p>

            <Link to={`/workshops/${workshop.id}`}>
              לפרטי הסדנה
            </Link>
          </article>
        ))}
      </div>

      <div className="pagination">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          הקודם
        </button>

        <span>
          עמוד {page} מתוך {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          הבא
        </button>
      </div>
    </div>
  );
}

export default Workshops;
