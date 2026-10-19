# WorkshopSystem Client

מערכת React לניהול וצפייה בסדנאות.

## טכנולוגיות
- React
- Vite
- React Router
- Axios

## יכולות למשתמש
- הרשמה והתחברות
- דף נחיתה
- חיפוש וסינון סדנאות
- צפייה בפרטי סדנה
- הרשמה לסדנה
- צפייה בהרשמות האישיות
- ביטול הרשמה

## יכולות מנהל
- ניהול סדנאות
- הוספה, עריכה ומחיקה
- ניהול קטגוריות
- צפייה בנרשמים לפי סדנה

## התקנה

npm install

## הגדרת API

יש ליצור קובץ .env:

VITE_API_URL=http://localhost:5125

## הרצה

npm run dev

## Build

npm run build

## Authentication

לאחר Login או Register נשמר JWT ב-localStorage.
Axios מוסיף את ה-Bearer Token לבקשות מוגנות.
