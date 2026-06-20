import { useParams } from "react-router-dom";
import useGetSharedAlbum from "../../hooks/useGetSharedAlbum";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const SharedAlbum = () => {    
    const { token } = useParams();
    const { sharedAlbum } = useSelector((store) => store.album);
    // console.log("token:", token);
    useGetSharedAlbum(token);

    return (
        <div className="min-h-screen bg-white">
            {/* Cover */}
            <div className="relative h-56 sm:h-72 md:h-96 w-full overflow-hidden" >
                <img src={sharedAlbum?.coverImage} alt={sharedAlbum?.name} className="h-full w-full object-cover" />

                <div className="absolute inset-0 bg-black/30" />

                <div className="absolute bottom-6 left-4 md:left-8 text-white">
                    <h1 className="text-3xl md:text-5xl font-bold" >{sharedAlbum?.name}</h1>
                    <p className="mt-2 text-sm md:text-base text-gray-200">
                        {sharedAlbum?.images?.length === 0 ? "No items" : sharedAlbum?.images?.length === 1 ? "1 item" : `${sharedAlbum?.images?.length} items`}
                    </p>
                </div>
            </div>

            {/* Info */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="rounded-2xl border p-5 shadow-sm">
                    <h2 className="text-lg font-semibold">Description</h2>

                    <p className="mt-2 text-gray-600">{sharedAlbum?.description}</p>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-xl border p-4">
                        <p className="text-sm text-gray-500">Photos</p>
                        <p className="text-2xl font-bold">{sharedAlbum?.images?.length}</p>
                    </div>

                    <div className="rounded-xl border p-4">
                        <p className="text-sm text-gray-500">Album ID</p>
                        <p className="truncate text-sm font-medium">{sharedAlbum?._id}</p>
                    </div>
                </div>

                {/* Images */}
                <div className="mt-8">
                    <h2 className="mb-4 text-2xl font-semibold">Photos</h2>

                    {sharedAlbum?.images?.length === 0 ? (
                        <div className="rounded-2xl border border-dashed p-10 text-center text-gray-500">
                            No photos in this album yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {sharedAlbum?.images?.map((image, index) => (
                                <div key={index} className="overflow-hidden rounded-xl" >
                                    <img src={sharedAlbum?.images?.[index]?.url} alt={`Photo ${index + 1}`} className="aspect-square w-full object-cover transition duration-300 hover:scale-105" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SharedAlbum;