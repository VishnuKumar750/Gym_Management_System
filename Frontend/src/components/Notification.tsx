import { Bell } from "lucide-react"

const Notification = () => {
  return (
    <div className="container mx-auto">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight my-4 dark:text-white">Notifications

            <Bell className="-rotate-45 size-6" />
        </h1>
        <div className="w-full p-4 dark:text-white border border-neutral-50 bg-neutral-100 dark:border-none dark:bg-neutral-700 shadow-md shadow-neutral-300 dark:shadow-neutral-800 rounded-xl ">
            <h3 className="text-lg font-bold text-neutral-800 dark:text-white">This month membership paid</h3>
            <p className="">23/07/2035</p>
        </div>
    </div>
  )
}

export default Notification
