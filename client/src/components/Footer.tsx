import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-gray-950/80 text-gray-400 text-sm mt-auto">
      <div className="max-w-6xl mx-auto px-4 md:px-16 lg:px-24 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/projects" className="hover:text-white transition">My Projects</Link>
          <Link to="/community" className="hover:text-white transition">Community</Link>
          <Link to="/pricing" className="hover:text-white transition">Pricing</Link>
        </div>
        <p className="text-gray-500">
          © {new Date().getFullYear()} AI Website Builder. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
