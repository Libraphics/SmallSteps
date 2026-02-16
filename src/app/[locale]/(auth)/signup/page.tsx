export default function SignupPage() {
  return (
    <div className="card max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-3">Sign up</h1>
      <form method="post" action="/api/objectives?mode=signup" className="space-y-2">
        <input name="email" type="email" placeholder="Email" className="w-full rounded-xl border px-3 py-2 text-black" required />
        <input name="password" type="password" placeholder="Password" className="w-full rounded-xl border px-3 py-2 text-black" required />
        <select name="locale" className="w-full rounded-xl border px-3 py-2 text-black">
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
        <button className="w-full rounded-xl bg-brand-600 text-white py-2">Create account</button>
      </form>
    </div>
  );
}
