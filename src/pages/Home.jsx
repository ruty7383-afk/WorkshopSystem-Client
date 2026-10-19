import { Link } from "react-router-dom";
import { getRole, isLoggedIn } from "../utils/auth";

function Home() {
  const loggedIn = isLoggedIn();
  const role = getRole();

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            המקום שלך ללמוד, ליצור ולהתקדם
          </div>

          <h1>
            סדנאות שמחברות בין
            <span> ידע, אנשים וחוויה</span>
          </h1>

          <p className="hero-text">
            גלו סדנאות איכותיות במגוון תחומים,
            הרשמו בקלות, עקבו אחר ההרשמות שלכם
            ותיהנו מחוויית משתמש פשוטה ונוחה.
          </p>

          <div className="hero-actions">
            <Link
              to="/workshops"
              className="btn btn-primary"
            >
              צפייה בסדנאות
            </Link>

            {!loggedIn && (
              <Link
                to="/register"
                className="btn btn-secondary"
              >
                הרשמה למערכת
              </Link>
            )}

            {role === "User" && (
              <Link
                to="/my-registrations"
                className="btn btn-secondary"
              >
                ההרשמות שלי
              </Link>
            )}

            {role === "Admin" && (
              <Link
                to="/admin/workshops"
                className="btn btn-secondary"
              >
                כניסה לניהול
              </Link>
            )}
          </div>

          <div className="hero-stats">
            <div>
              <strong>מגוון</strong>
              <span>סדנאות ותחומים</span>
            </div>

            <div>
              <strong>פשוט</strong>
              <span>הרשמה וביטול</span>
            </div>

            <div>
              <strong>חכם</strong>
              <span>ניהול מקומות בזמן אמת</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-card floating-card-main">
            <span className="mini-label">
              הסדנה הבאה שלך
            </span>

            <h3>ללמוד. להתנסות. להתקדם.</h3>

            <div className="visual-line">
              <span>✓</span>
              <p>בחירת סדנה שמתאימה לך</p>
            </div>

            <div className="visual-line">
              <span>✓</span>
              <p>הרשמה מהירה ופשוטה</p>
            </div>

            <div className="visual-line">
              <span>✓</span>
              <p>מעקב אחר כל ההרשמות במקום אחד</p>
            </div>
          </div>

          <div className="floating-card floating-card-small top-card">
            <div className="visual-icon">✦</div>
            <strong>חוויה איכותית</strong>
            <small>ממשק נוח וברור</small>
          </div>

          <div className="floating-card floating-card-small bottom-card">
            <div className="visual-icon">◉</div>
            <strong>מקומות בזמן אמת</strong>
            <small>תמיד יודעים אם נשאר מקום</small>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <span className="eyebrow">למה WorkshopSystem?</span>
          <h2>כל מה שצריך במקום אחד</h2>
          <p>
            מערכת פשוטה ונוחה שמאפשרת למשתמשים
            למצוא סדנאות ולהירשם, ולמנהלים לנהל
            את כל הפעילות בצורה מסודרת.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon blue">⌕</div>
            <h3>מוצאים בדיוק מה שמתאים</h3>
            <p>
              חיפוש, סינון, מיון וקטגוריות כדי
              להגיע במהירות לסדנה הרצויה.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon green">✓</div>
            <h3>נרשמים בקלות</h3>
            <p>
              הרשמה פשוטה, צפייה במקומות פנויים
              ומעקב אחר ההרשמות האישיות.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon orange">↺</div>
            <h3>שליטה מלאה בהרשמות</h3>
            <p>
              ניתן לבטל הרשמה לפני תחילת הסדנה
              ולקבל החזר בהתאם לכללי המערכת.
            </p>
          </article>
        </div>
      </section>

      <section className="journey-section">
        <div className="journey-box">
          <div>
            <span className="eyebrow light">
              הדרך שלך מתחילה כאן
            </span>

            <h2>
              מוכנים למצוא את הסדנה הבאה שלכם?
            </h2>

            <p>
              עברו לרשימת הסדנאות, סננו לפי
              תחום, יום, זמינות ומחיר ובחרו
              את מה שהכי מתאים לכם.
            </p>
          </div>

          <Link
            to="/workshops"
            className="btn btn-light"
          >
            לכל הסדנאות
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
