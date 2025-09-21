import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="search">
            <div>
                <img src="./search.svg" alt="Tìm kiếm" />
                <input
                    type="text"
                    placeholder="Tìm kiếm hàng ngàn bộ phim..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    )
}

export default Search