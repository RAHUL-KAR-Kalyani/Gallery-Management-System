import './App.css'
import { useEffect } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import MainLayout from './MainLayout'
import { useSelector } from 'react-redux'
import Home from './components/extra/Home'
import Images from './components/images/Images'
import ImageUpload from './components/images/ImageUpload'
import ImageUpdate from './components/images/ImageUpdate'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import ViewImages from './components/images/ViewImages'
import Album from './components/album/Album'
import CreateAlbum from './components/album/CreateAlbum'
import AlbumDetails from './components/album/AlbumDetails'
import SharedAlbum from './components/album/SharedAlbum'


function App() {
	useEffect(() => {
		document.title = "PixVault - Your Personal Gallery";
	}, []);

	const { user } = useSelector((store) => store.auth);

	const appRouter = createBrowserRouter([

		// PUBLIC ROUTES		
		{
			path: "/",
			element: !user ? <Login /> : <Navigate to="/home" />,
		},
		{
			path: "/signup",
			element: <Signup />
		},
		{
			path: "/login",
			element: <Login />
		},
		{
			path: "/albums/:id",
			element: <AlbumDetails />
		},
		{
			path: "/shared/:token",
			element: <SharedAlbum />
		},

		// PROTECTED ROUTES
		{
			element: <MainLayout />,
			children: [
				{
					path: "/home",
					element: <Home />,
				},
				{
					path: "/images",
					element: <Images />,
				},
				{
					path: "/upload",
					element: <ImageUpload />,
				},
				{
					path: "/update-images/:id",
					element: <ImageUpdate />
				},
				{
					path: "/view-images/:id",
					element: <ViewImages />
				},
				{
					path: "/albums",
					element: <Album />
				},
				{
					path: "/create-album",
					element: <CreateAlbum />
				},
				{
					path: "/update-album/:id",
					element: <CreateAlbum />
				},
				// {
				// 	path: "/shared/:token",
				// 	element: <SharedAlbum />
				// }

			]
		}

	]);

	return (
		<div>
			<RouterProvider router={appRouter} />
		</div>
	)
}

export default App
