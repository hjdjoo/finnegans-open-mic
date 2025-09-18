export default function Spinner() {


  // Spinner component nested inside of a div for centering and size
  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="animate-spin size-7 border-3 border-current border-t-transparent text-blue-800 rounded-full dark:text-gray-400" />
    </div>
  )
}