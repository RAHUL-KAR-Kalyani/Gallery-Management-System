import React, { useEffect } from 'react'

const Profile = () => {
    useEffect(() => {
        document.title = "Profile"
    }, [])
    return (
        <div>Profile</div>
    )
}

export default Profile