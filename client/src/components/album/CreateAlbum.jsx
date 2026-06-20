import { useEffect, useState } from "react";
import axios from "axios";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import imageCompression from 'browser-image-compression';

const CreateAlbum = () => {
    useEffect(() => {
        document.title = "Create Album"
    }, []);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ name: "", description: "" });

    const [coverImage, setCoverImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value, });
    };

    const imageHandler = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setCoverImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const data = new FormData();

            data.append("name", formData.name);
            data.append("description", formData.description);

            // Compress cover image if selected
            if (coverImage) {
                const compressedCover = await imageCompression(coverImage, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    initialQuality: 0.9,
                });

                // console.log("Original Cover Size:", (coverImage.size / 1024 / 1024).toFixed(2), "MB");
                // console.log("Compressed Cover Size:", (compressedCover.size / 1024 / 1024).toFixed(2), "MB");
                data.append("coverImage", compressedCover);
            }

            const response = await axios.post(`${import.meta.env.VITE_ALBUM_ENDPOINT}/create`, data, { withCredentials: true });

            if (response.data.success) {
                // console.log(response)
                toast.success(response?.data?.message);
                navigate("/albums");
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
            <div className="w-full rounded-xl p-6">
                <h1 className="text-3xl font-semibold mb-6">
                    Create Album
                </h1>

                <form onSubmit={submitHandler} className="space-y-5 w-full" >
                    {/* Album Name */}
                    <div>
                        <label className="block mb-2 font-medium">
                            Album Name
                        </label>

                        <input type="text" name="name" value={formData.name} onChange={changeHandler} placeholder="Enter album name" className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block mb-2 font-medium">
                            Description
                        </label>

                        <textarea name="description" rows="4" value={formData.description} onChange={changeHandler} placeholder="Enter album description" className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500" required />
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label className="block mb-2 font-medium">
                            Cover Image
                        </label>

                        <label className="flex items-center justify-center border-2 border-dashed rounded-lg h-48 cursor-pointer hover:bg-gray-50">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="h-full w-full object-cover rounded-lg"
                                />
                            ) : (
                                <div className="text-center">
                                    <ImagePlus
                                        size={40}
                                        className="mx-auto text-gray-400"
                                    />
                                    <p className="mt-2 text-gray-500">
                                        Click to upload image
                                    </p>
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={imageHandler}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Creating Album..." : "Create Album"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateAlbum;