import GlassSurface from "./GlassContainer";

const placeholder = () => {
    return (
        <>
            <div className="w-[50px] h-[50px] bg-gray-400 rounded-full"></div>
        </>
    )
}

const NavComp = () => {
    return (
        <nav className="fixed bottom-0 left-0 w-full flex justify-center items-center p-4 z-50">
            <GlassSurface 
            width={7*(50+10)+10}
            height={70}
            borderRadius={50}
            >
                <div className="flex justify-around w-full">
                    {[...Array(7)].map((_, index) => (
                        <>
                            {placeholder()}
                        </>
                    ))}
                </div>
            </GlassSurface>
        </nav>
    )
}

export default NavComp;