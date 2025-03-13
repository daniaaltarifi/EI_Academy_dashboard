import React, { useState, useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/addCourse.css";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import Spinner from "react-bootstrap/Spinner";
import { API_URL } from "../App";
import { useNavigate } from "react-router-dom";

function AddTestBank() {
  const [excelFile, setExcelFile] = useState(null);
  const [before_price, setbefore_price] = useState("");
  const [after_price, setafter_price] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
    const [img, setImg] = useState(null);
    const [selectedDefaultVideo, setSelectedDefaultVideo] = useState(null);
  
  const navigate = useNavigate();


  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleExcelFile = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_FILE_SIZE) {
      Toastify({
        text: "حجم الملف يتجاوز الحد المسموح به (5 ميجابايت)",
        duration: 3000,
        gravity: "top",
        position: "right",
        background: "#CA1616",
      }).showToast();
      return;
    }
    setExcelFile(file);
  };
  const handleDefaultVideo = (e) => {
    const file = e.target.files[0];
    // if (file && file.size > MAX_FILE_SIZE) {
    //   Toastify({
    //     text: "File size exceeds the 1 GB limit",
    //     duration: 3000,
    //     gravity: "top",
    //     position: "right",
    //     background: "#CA1616",
    //   }).showToast();
    //   return; // Prevent file from being uploaded
    // }
    setSelectedDefaultVideo(file);
  };
 


  const handleImg = (e) => {
    const file = e.target.files[0];
    setImg(file);
  };
  const handleSubmit = async () => {
    setLoading(true);

    if (!before_price || !after_price || !description || !img || !selectedDefaultVideo || !excelFile) {
      Toastify({
        text: "الرجاء ملء جميع الحقول",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#CA1616",
      }).showToast();
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("before_price", before_price);
      formData.append("after_price", after_price);
      formData.append("image", img);
      formData.append("video", selectedDefaultVideo);
      formData.append("excelsheet", excelFile);

      const response = await axios.post(
        `${API_URL}/testbank/addtestbank`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Toastify({
        text: "تمت إضافة بنك الأسئلة بنجاح",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#018abe",
      }).showToast();
      navigate("/testbank");
    } catch (error) {
      if (error.response && error.response.status === 413) {
        Toastify({
          text: "حجم الملف يتجاوز الحد المسموح به",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#CA1616",
        }).showToast();
      } else {
        Toastify({
          text: "حدث خطأ أثناء رفع الملف",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#CA1616",
        }).showToast();
      }
      console.error("Error submitting test bank:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar title={"بنوك الأسئلة"} />
      <div className="container">
        <div className="row">
          <div className="col-lg-2 col-md-6 col-sm-12">
            <div className="title_add_course">إضافة بنك أسئلة</div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">السعر قبل الخصم</p>
            <input
              type="number"
              className="input_addcourse"
              onChange={(e) => setbefore_price(e.target.value)}
            />
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">السعر بعد الخصم</p>
            <input
              type="number"
              className="input_addcourse"
              onChange={(e) => setafter_price(e.target.value)}
            />
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <p className="input_title_addcourse">الوصف</p>
            <textarea
              type="text"
              className="input_textarea_addcourse"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="row mt-5">

        <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">صورة بنك الاسئلة</p>
            <div className="file-input-container">
              <input
                type="file"
                className="choose_file_addcourse"
                onChange={handleImg}
              />{" "}
              <span className="ps-5">اختر صورة </span>
              {img && <span>{img.name}</span>}
              {!img && (
                <span className="selected_file_addcourse">
                  No file selected
                </span>
              )}
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">فيديو مقدمة</p>
            <div className="file-input-container">
              <input
                type="file"
                className="choose_file_addcourse"
                onChange={handleDefaultVideo}
                accept="video/*"
              />
              <span className="ps-5 selected_file_addcourse">اختر فيديو</span>
              {selectedDefaultVideo && (
                <span className="selected_file_addcourse">
                  {selectedDefaultVideo.name}
                </span>
              )}
              {!selectedDefaultVideo && (
                <span className="selected_file_addcourse ">
                  No file selected
                </span>
              )}
            </div>
</div>
</div>
        <div className="row mt-5">
          <div className="col-lg-6 col-md-12 col-sm-12">
            <p className="input_title_addcourse">ملف بنك الأسئلة (Excel)</p>
            <div className="file-input-container">
              <input
                type="file"
                className="choose_file_addcourse"
                onChange={handleExcelFile}
                accept=".xlsx, .xls, .csv"
              />
              <span className="ps-5">اختر ملف Excel</span>
              {excelFile && (
                <span className="selected_file_addcourse">{excelFile.name}</span>
              )}
              {!excelFile && (
                <span className="selected_file_addcourse">
                  لم يتم اختيار ملف
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-lg-12 col-md-12 col-sm-12 text-center">
            <button
              className="btn_addCourse px-5 py-2"
              onClick={handleSubmit}
            >
              {loading && (
                <Spinner
                  animation="border"
                  variant="warning"
                  size="sm"
                  className="spinner_course"
                />
              )}
              إضافة بنك الأسئلة
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddTestBank;