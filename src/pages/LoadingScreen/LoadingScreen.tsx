
export default function LoadingScreen() {
  return (
    <div className="relative flex my-[10vw]">
      <div className="absolute bg-white bg-opacity-60 z-10 h-full w-full flex items-center justify-center">
        <div className="flex items-center py-4">
          <span className=" mr-4 text-6xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-200 to-red-400">Loading</span>
          <div className="">
            <div className="p-4 bg-gradient-to-tr animate-spin from-amber-200 via-amber-200 to-red-400 rounded-full">
              <div className="bg-white rounded-full">
                <div className="w-10 h-10 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
