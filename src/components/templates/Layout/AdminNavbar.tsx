import Link from "next/link";

export default function AdminNavbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold text-gray-900">
              Gatherlove
            </Link>
          </div>
          <div className="hidden md:flex space-x-4">
            <a href="/admin" className="text-gray-700 hover:text-gray-900">
              Dashboard
            </a>
            <a
              href="/admin/campaigns"
              className="text-gray-700 hover:text-gray-900"
            >
              Campaigns
            </a>
            <a
              href="/admin/users"
              className="text-gray-700 hover:text-gray-900"
            >
              Users
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
