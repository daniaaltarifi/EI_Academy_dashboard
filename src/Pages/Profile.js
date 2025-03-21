import React, { useState, useEffect, useRef ,useContext} from 'react';
import axios from 'axios';
import "../Css/auth.css";
import defaultImage from '../assets/profile.png';
import NavBar from '../component/NavBar';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../App';
function Profile() {
  const [successMessage, setSuccessMessage] = useState('');
  const {user,updateUser}=useContext(UserContext)
  const { userId } = user;
const navigate = useNavigate()
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    img: '',
    password: '',
    confirmPassword: '',
  });

  const [imageUrl, setImageUrl] = useState(null); // Initialize with defaultImage

  const fileInputRef = useRef(null);
  useEffect(() => {
    if (user.userId) {
      axios.get(`${API_URL}/profile/getProfileUsers/${user.userId}`)
        .then(response => {
          setProfile({
            name: response.data.name,
            email: response.data.email,
            img: response.data.img,
            password: '',
            confirmPassword: ''
          });
          // Set the image URL from the profile data
          setImageUrl(`https://res.cloudinary.com/durjqlivi/${response.data.img}`);
        })
        .catch(error => {
          console.error('There was an error fetching the profile!', error);
        });
    }
  }, [user.userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('email', profile.email);
    formData.append('password', profile.password);
    formData.append('confirmPassword', profile.confirmPassword);
    // formData.append('img', profile.img);
    
    if (profile.img instanceof File) {
      formData.append('img', profile.img);
    }
  
    try {
      const response = await axios.put(`${API_URL}/profile/updateProfile/${user.userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Update the image URL with the new image URL from the server
        setImageUrl(`https://res.cloudinary.com/durjqlivi/${response.data.img}`);
  setSuccessMessage('تم تعديل حسابك');
      updateUser(profile.name,userId,response.data.img)
  setProfile(prevState => ({
  ...prevState,
  name: response.data.name,
  img: response.data.img,
  }));
  window.location.reload();
  } catch (error) {
  console.error('Error updating profile:', error);
  }
  };


const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Set the profile image file
    setProfile(prevProfile => ({
      ...prevProfile,
      img: file
    }));
    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);

    // Clean up the object URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  }
  
};

const handleButtonClick = () => {
  if (fileInputRef.current) {
    fileInputRef.current.click();
  }
};

// const handleSubmit = (e) => {
//   e.preventDefault();
//   handleUpdate();
// };

  return (
    <>
          <NavBar title={"حسابي"} />

      <section className="margin_section">
        <div className="container text-center">
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-12 ">
              <p className="profile_title">حسابي</p>
              <button className="img_profile" onClick={handleButtonClick}>
                <img
                  src={imageUrl}
                  alt=""
                  className="img-fluid"
                />
              </button>
              <input
                type="file"
                name='img'
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
            <div className="col-lg-9 col-md-8 col-sm-12">
              <div className="row m-5">
                <div className="col-lg-6 col-md-12 col-sm-12">
                  <p className="title_of_input_auth">الاسم</p>
                  <input
                    type="text"
                    className="search_blog"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-lg-6 col-md-12 col-sm-12">
                  <p className="title_of_input_auth">البريد الالكتروني</p>
                  <input
                    type="text"
                    className="search_blog"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="row m-5">
                <div className="col-lg-6 col-md-12 col-sm-12">
                  <p className="title_of_input_auth">كلمة المرور</p>
                  <input
                    type="password"
                    className="search_blog"
                    name="password"
                    value={profile.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-lg-6 col-md-12 col-sm-12 ">
                  <p className="title_of_input_auth">تأكيد كلمة المرور</p>
                  <input
                    type="password"
                    className="search_blog"
                    name="confirmPassword"
                    value={profile.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              {successMessage && <p className="success_message">{successMessage}</p>}
              <button type="button" className="btn purple_btn mb-2 px-5" onClick={handleUpdate}>حفظ</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;