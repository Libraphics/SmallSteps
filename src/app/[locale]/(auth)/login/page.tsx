export default function LoginPage() {
  return (
    <div className="card max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-3">Login</h1>
      <form method="post" action="/api/auth/callback/credentials" className="space-y-2">
        <input name="email" type="email" placeholder="Email" className="w-full rounded-xl border px-3 py-2 text-black" required />
        <input name="password" type="password" placeholder="Password" className="w-full rounded-xl border px-3 py-2 text-black" required />
        <label className="text-sm flex items-center gap-2"><input type="checkbox" name="remember"/> Remember me</label>
        <button className="w-full rounded-xl bg-brand-600 text-white py-2">Login</button>
      </form>
      <a href="/en/signup" className="text-sm text-brand-600">Create account</a>
    </div>
  );
}
