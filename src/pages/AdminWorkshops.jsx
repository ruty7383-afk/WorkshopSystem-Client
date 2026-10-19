import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const emptyForm = {
  name: "",
  description: "",
  startDate: "",
  dayOfWeek: "0",
  startTime: "18:00:00",
  durationMinutes: 60,
  numberOfMeetings: 1,
  price: 0,
  capacity: 1,
  categoryId: "",
};

const days = [
  "ראשון",
  "שני",
  "שלישי",
  "רביעי",
  "חמישי",
  "שישי",
  "שבת",
];

function AdminWorkshops() {
  const [workshops, setWorkshops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const [workshopResponse, categoryResponse] =
        await Promise.all([
          apiClient.get("/api/workshops", {
            params: {
              page: 1,
              pageSize: 100,
            },
          }),
          apiClient.get("/api/categories"),
        ]);

      setWorkshops(
        workshopResponse.data.items ?? []
      );

      setCategories(categoryResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.message ??
        "לא ניתן לטעון את הנתונים"
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const body = () => ({
    name: form.name,
    description: form.description,
    startDate: form.startDate,
    dayOfWeek: Number(form.dayOfWeek),
    startTime: form.startTime,
    durationMinutes: Number(form.durationMinutes),
    numberOfMeetings: Number(form.numberOfMeetings),
    price: Number(form.price),
    capacity: Number(form.capacity),
    categoryId: Number(form.categoryId),
  });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      if (editId) {
        await apiClient.put(
          `/api/workshops/${editId}`,
          body()
        );

        setMessage("הסדנה עודכנה בהצלחה");
      } else {
        await apiClient.post(
          "/api/workshops",
          body()
        );

        setMessage("הסדנה נוספה בהצלחה");
      }

      setForm(emptyForm);
      setEditId(null);

      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ??
        "שמירת הסדנה נכשלה"
      );
    }
  };

  const edit = async (id) => {
    try {
      setError("");
      setMessage("");

      const response = await apiClient.get(
        `/api/workshops/${id}`
      );

      const w = response.data;

      setEditId(id);

      setForm({
        name: w.name ?? "",
        description: w.description ?? "",
        startDate: w.startDate?.slice(0, 10) ?? "",
        dayOfWeek: String(w.dayOfWeek ?? 0),
        startTime: w.startTime ?? "18:00:00",
        durationMinutes: w.durationMinutes ?? 60,
        numberOfMeetings: w.numberOfMeetings ?? 1,
        price: w.price ?? 0,
        capacity: w.capacity ?? 1,
        categoryId: String(w.categoryId ?? ""),
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ??
        "לא ניתן לטעון את הסדנה"
      );
    }
  };

  const remove = async (id) => {
    if (!window.confirm("האם למחוק את הסדנה?")) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await apiClient.delete(
        `/api/workshops/${id}`
      );

      setMessage("הסדנה נמחקה");
      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ??
        "לא ניתן למחוק את הסדנה"
      );
    }
  };

  return (
    <div className="page">
      <h1>ניהול סדנאות</h1>

      <form className="form admin-form" onSubmit={submit}>
        <label>
          שם הסדנה
          <input
            name="name"
            value={form.name}
            onChange={change}
            required
          />
        </label>

        <label>
          תיאור
          <textarea
            name="description"
            value={form.description}
            onChange={change}
          />
        </label>

        <label>
          תאריך התחלה
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={change}
            required
          />
        </label>

        <label>
          יום
          <select
            name="dayOfWeek"
            value={form.dayOfWeek}
            onChange={change}
          >
            {days.map((day, index) => (
              <option key={index} value={index}>
                {day}
              </option>
            ))}
          </select>
        </label>

        <label>
          שעת התחלה
          <input
            type="time"
            step="1"
            name="startTime"
            value={form.startTime}
            onChange={change}
            required
          />
        </label>

        <label>
          משך מפגש בדקות
          <input
            type="number"
            name="durationMinutes"
            value={form.durationMinutes}
            onChange={change}
            min="1"
            required
          />
        </label>

        <label>
          מספר מפגשים
          <input
            type="number"
            name="numberOfMeetings"
            value={form.numberOfMeetings}
            onChange={change}
            min="1"
            required
          />
        </label>

        <label>
          מחיר
          <input
            type="number"
            step="0.01"
            name="price"
            value={form.price}
            onChange={change}
            min="0"
            required
          />
        </label>

        <label>
          מספר מקומות
          <input
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={change}
            min="1"
            required
          />
        </label>

        <label>
          קטגוריה
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={change}
            required
          >
            <option value="">
              בחרי קטגוריה
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">
          {editId
            ? "שמירת שינויים"
            : "הוספת סדנה"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm(emptyForm);
            }}
          >
            ביטול עריכה
          </button>
        )}
      </form>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <h2>הסדנאות הקיימות</h2>

      <div className="cards">
        {workshops.map((workshop) => (
          <article className="card" key={workshop.id}>
            <h3>{workshop.name}</h3>

            <p>
              מחיר: ₪{workshop.price}
            </p>

            <p>
              מספר מקומות: {workshop.capacity}
            </p>

            <p>
              מקומות פנויים: {workshop.availablePlaces}
            </p>

            <button onClick={() => edit(workshop.id)}>
              עריכה
            </button>

            <button onClick={() => remove(workshop.id)}>
              מחיקה
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

export default AdminWorkshops;
