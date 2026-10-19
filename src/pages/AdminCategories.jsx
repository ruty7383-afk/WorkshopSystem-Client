import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const response = await apiClient.get("/api/categories");
      setCategories(response.data);
    } catch {
      setError("לא ניתן לטעון את הקטגוריות");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      if (editId) {
        await apiClient.put(
          `/api/categories/${editId}`,
          { name }
        );

        setMessage("הקטגוריה עודכנה בהצלחה");
      } else {
        await apiClient.post(
          "/api/categories",
          { name }
        );

        setMessage("הקטגוריה נוספה בהצלחה");
      }

      setName("");
      setEditId(null);
      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ??
        "הפעולה נכשלה"
      );
    }
  };

  const edit = (category) => {
    setEditId(category.id);
    setName(category.name);
    setError("");
    setMessage("");
  };

  const remove = async (id) => {
    if (!window.confirm("האם למחוק את הקטגוריה?")) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await apiClient.delete(
        `/api/categories/${id}`
      );

      setMessage("הקטגוריה נמחקה");
      await load();
    } catch (err) {
      setError(
        err.response?.data?.message ??
        "לא ניתן למחוק את הקטגוריה"
      );
    }
  };

  return (
    <div className="page narrow">
      <h1>ניהול קטגוריות</h1>

      <form className="form" onSubmit={submit}>
        <label>
          שם הקטגוריה
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <button type="submit">
          {editId ? "שמירת שינויים" : "הוספת קטגוריה"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setName("");
            }}
          >
            ביטול עריכה
          </button>
        )}
      </form>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      {categories.map((category) => (
        <div className="row" key={category.id}>
          <span>{category.name}</span>

          <div>
            <button onClick={() => edit(category)}>
              עריכה
            </button>

            <button onClick={() => remove(category.id)}>
              מחיקה
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminCategories;
