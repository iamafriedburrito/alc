import Sidebar from "./Sidebar"
import { Outlet } from "react-router"

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AppLayout

