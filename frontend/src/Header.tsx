type Props = {
    setSearchTerm: (value: string) => any
}
const Header = ({setSearchTerm}: Props) => {
    return (
        <div className="flex">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Policies</h1>
            <div className="ml-auto">
                <div className="mt-1">
                    <input
                        type="text"
                        name="search"
                        id="search"
                        className="shadow-sm block w-full sm:text-sm border-gray-500 px-4 rounded-full h-10"
                        placeholder="search"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </div>
    )
};

export default Header;
