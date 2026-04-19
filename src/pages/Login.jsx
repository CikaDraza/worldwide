import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <svg width="36" height="22" viewBox="0 0 23 14" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.5 12.3623C10.2832 13.3843 8.71387 14 7 14C3.13379 14 0 10.8662 0 7C0 3.13379 3.13379 0 7 0C8.71387 0 10.2832 0.615723 11.5 1.6377C12.7168 0.615723 14.2861 0 16 0C19.8662 0 23 3.13379 23 7C23 10.8662 19.8662 14 16 14C14.2861 14 12.7168 13.3843 11.5 12.3623ZM5.68951 3.39838C5.30844 3.61838 5.17788 4.10565 5.39789 4.48671L8.70376 10.2126C8.77042 10.3281 8.86162 10.4206 8.96696 10.4873C9.0246 10.5552 9.09472 10.6146 9.17633 10.6617C9.55739 10.8817 10.0447 10.7511 10.2647 10.3701L11.7207 7.84807L13.828 9.95531C13.8655 9.99282 13.9058 10.0258 13.9483 10.0543C13.9849 10.0856 14.025 10.1141 14.0683 10.1391C14.4494 10.3591 14.9367 10.2285 15.1567 9.84748L18.0667 4.80721C18.2867 4.42614 18.1561 3.93888 17.7751 3.71887C17.394 3.49886 16.9067 3.62943 16.6867 4.01049L14.2892 8.16309L12.4267 6.30053C12.3181 6.19197 12.186 6.12129 12.0468 6.08849C11.9998 6.04243 11.9464 6.00148 11.8868 5.96707C11.5057 5.74706 11.0184 5.87762 10.7984 6.25868L9.52966 8.45628L6.77784 3.69C6.55784 3.30893 6.07057 3.17837 5.68951 3.39838Z"
              fill="#20F3C7"
            />
          </svg>
          <span className="text-white font-bold text-xl">Worldwide</span>
        </div>

        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl p-8">
          <h1 className="text-xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-xl text-white text-sm placeholder-gray-700 focus:outline-none focus:border-[#20F3C7]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-xl text-white text-sm placeholder-gray-700 focus:outline-none focus:border-[#20F3C7]/50 transition-colors"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 accent-[#20F3C7]"
                />
                <span className="text-xs text-gray-500">Remember me</span>
              </label>
              <button className="text-xs text-[#20F3C7] hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              className="w-full py-2.5 rounded-xl font-semibold text-sm text-[#111] transition-all hover:brightness-110 active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #20F3C7, #66C7DC)",
              }}
            >
              Sign In
            </button>
          </div>

          <p className="text-center text-xs text-gray-600 mt-6">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-[#20F3C7] hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <Link
          to="/"
          className="block text-center mt-4 text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}
