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
  const [testName, setTestName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [departmentData, setDepartmentData] = useState([]);
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

  const handleDepartment = (e) => {
    const selectedDepartmentId = e.target.value;
    setDepartmentId(selectedDepartmentId);
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/departments/getDepartments`
        );
        setDepartmentData(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);

    if (!testName || !departmentId || !description || !excelFile) {
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
      formData.append("test_name", testName);
      formData.append("department_id", departmentId);
      formData.append("description", description);
      formData.append("excel_file", excelFile);

      const response = await axios.post(
        `${API_URL}/TestBank/addtestbank`,
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
      navigate("/testbanks");
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
            <p className="input_title_addcourse">اسم الاختبار</p>
            <input
              type="text"
              className="input_addcourse"
              onChange={(e) => setTestName(e.target.value)}
            />
          </div>
          <div className="col-lg-4 col-md-6 col-sm-12">
            <p className="input_title_addcourse">القسم</p>
            <select
              name="department"
              value={departmentId}
              onChange={handleDepartment}
              id="lang"
              className="select_dep"
            >
              <option value="">اختر قسم</option>
              {departmentData.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.title}
                </option>
              ))}
            </select>
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