import React, { useEffect, useState } from "react";
import Api from "../../api/Api";
import "../../css/Components/profilePage/profile.css";
import Auth from "../../services/Auth"

export default function ProfilePage() {


    const onLogout = () => Auth.logout();
    const uploadedImage = React.useRef(null);
    const imageUploader = React.useRef(null);
    const [user, setUser] = useState('');
    const [imgUrl, setImgUrl] = useState('');


     const updateUser = (updatedUser) => {
                    Api.put("/user", updateUser).then((res) => setUser(res.data));
                  };

    const handleImageUpload = e => {
        const [file] = e.target.files;
        if (file) {
            const reader = new FileReader();
            const { current } = uploadedImage;
           
            current.file = file;
            reader.onload = e => {
                current.src = e.target.result;
            };
            reader.onload = e => {
                current.src = e.target.result;
                const imageURL = URL.createObjectURL(file);
                setImgUrl(imageURL);
                console.log(imageURL);
            };
            reader.readAsDataURL(file);
            updateUser();

        }
    };

    useEffect(() => {
        Api.get("/user/me").then((response) => {
            const user = response.data;
            setUser(user);

        });
    }, []);
    console.log(user);



    return (

        <div className="profilePage">

            <div className = "imgOuterContainer">
                <div className="img-container" onClick={() => imageUploader.current.click()}  >

                   
                    <img className="profileImg" 
                        ref={uploadedImage}
                    />

            </div>

                <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        ref={imageUploader}
                        style={{  display: "none"  }}    />
            </div>



            <div>
                <h1>{user.name}</h1>
                <h2>{user.email}</h2>
            </div>

            <div className="profileTools">

                <div><i class="fas fa-bell"></i></div>
                <div><i class="fas fa-inbox"></i></div>
                <div><i class="fas fa-calendar-alt"></i></div>

            </div>







            <button onClick={onLogout}>Logout</button>



        </div>


    )
}