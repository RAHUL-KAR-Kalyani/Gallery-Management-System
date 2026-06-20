import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ArrowUpFromLine, Image, Album } from "lucide-react"

const Sidebar = ({ open, setOpen }) => {
    const { user } = useSelector((store) => store.auth)
    const location = useLocation()

    const adminMenuItems = [
        { name: "Dashboard", path: "/home", icon: <LayoutDashboard size={18} /> },
        { name: "Images", path: "/images", icon: <Image size={18} /> },
        { name: "Upload Images", path: "/upload", icon: <ArrowUpFromLine size={18} /> },
        { name: "Album", path: "/albums", icon: <Album size={18} /> },
        { name: "Create Album", path: "/create-album", icon: <Album size={18} /> },
        // { name: "Album Images", path: "/upload", icon: <LayoutDashboard size={18} /> },
    ]

    const UserMenuItems = [
        { name: "Dashboard", path: "/home", icon: <LayoutDashboard size={18} /> },
        { name: "Images", path: "/images", icon: <Image size={18} /> },
        { name: "Upload Images", path: "/upload", icon: <ArrowUpFromLine size={18} /> },
        { name: "Album", path: "/albums", icon: <Album size={18} /> },
        { name: "Create Album", path: "/create-album", icon: <Album size={18} /> },
        // { name: "Album Images", path: "/upload", icon: <LayoutDashboard size={18} /> },
    ]

    const menuItems =
        user?.role !== 'user' ? adminMenuItems : UserMenuItems

    return (
        <aside className={`fixed top-12 left-0 z-40 h-screen w-64 backdrop-blur-xl bg-black/80 border-r border-white/10 text-white transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`} >
            <nav className="px-3 py-6 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                        <Link key={item.name} to={item.path} onClick={() => setOpen(false)} className={`outline-none relative flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 group ${isActive ? 'bg-white text-black shadow-lg' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
                            {isActive && (
                                <span className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-r-full"></span>
                            )}

                            <span className={`${isActive ? "text-indigo-600" : "text-white/70 group-hover:text-white"}`}>
                                {item.icon}
                            </span>

                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}

export default Sidebar