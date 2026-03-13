import { useReducer, useState, useMemo, useCallback, useEffect } from "react";
import useFetchPhotos from "../Hooks/Hooks.jsx";
import { favouritesReducer } from "../Reducers/Reducer.jsx";

export default function Gallery() {
    const { photos, loading, error } = useFetchPhotos();

    const [search, setSearch] = useState("");

    const [favourites, dispatch] = useReducer(favouritesReducer, []);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("favourites")) || [];
        dispatch({ type: "INIT", payload: stored });
    }, []);

    // search handler
    const handleSearch = useCallback((e) => {
        setSearch(e.target.value);
    }, []);

    // filtered photos
    const filteredPhotos = useMemo(() => {
        return photos.filter((photo) =>
            photo.author.toLowerCase().includes(search.toLowerCase())
        );
    }, [photos, search]);

    // toggle favourite
    const toggleFav = (photo) => {
        dispatch({ type: "TOGGLE_FAV", payload: photo });
    };

    // check favourite
    const isFav = (id) => favourites.some((p) => p.id === id);

    // loading state
    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black"></div>
            </div>
        );

    // error state
    if (error)
        return (
            <div className="text-center text-red-500 mt-10">
                Error: {error}
            </div>
        );

    return (
        <div className="p-6">
            <input
                type="text"
                placeholder="Search by author..."
                value={search}
                onChange={handleSearch}
                className="w-full p-3 border rounded mb-6"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredPhotos.map((photo) => (
                    <div key={photo.id} className="border rounded-lg overflow-hidden shadow">
                        <img
                            src={photo.download_url}
                            alt={photo.author}
                            className="w-full h-60 object-cover"
                        />

                        <div className="flex justify-between items-center p-3">
                            <p className="text-sm font-medium">{photo.author}</p>

                            <button
                                onClick={() => toggleFav(photo)}
                                className="text-xl"
                            >
                                {isFav(photo.id) ? "❤️" : "🤍"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}