import React, { useState, useEffect } from "react";
import NavBar from "../component/NavBar";
import "../Css/order.css";
import Table from "react-bootstrap/Table";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import DeletePopUp from "../component/DeletePopUp";
import Spinner from "react-bootstrap/Spinner";
import { API_URL } from "../App";

function Order() {
  const [activeButton, setActiveButton] = useState("btn1");
  const [departmentOrder, setDepartmentOrder] = useState([]);
  const [courseOrder, setCourseOrder] = useState([]);
  const [questionBankOrder, setQuestionBankOrder] = useState([]);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [smShow, setSmShow] = useState(false);
  const [titlePopup, setTitlePopup] = useState(""); 
  const [descriptionPopup, setDescriptionPopup] = useState("");
  const [currentId, setCurrentId] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [noCoursesMessage, setNoCoursesMessage] = useState('');
  const [noDepartmentMessage, setNoDepartmentessage] = useState('');
  const [noQuestionBankMessage, setNoQuestionBankMessage] = useState('');

  
  const handleClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  const handleOpenModal = (id) => {
    setCurrentId(id);
    setSmShow(true);
    setTitlePopup("حذف طلب شراء"); 
    setDescriptionPopup("هل أنت متأكد من حذف طلب الشراء  ؟"); 
  };
  
  const handleCloseModal = () => {
    setSmShow(false);
  };
  
  
  const getButtonColor = (buttonId) => {
    return activeButton === buttonId ? "#018abe" : "#f8c36e";
  };
  
  const fetchDepartmentOrder = async () => {
    setLoading(true);
    setNoDepartmentessage('');
    
    try {
      const response = await axios.get(`${API_URL}/PaymentsDepartments/getpaymentdata`);
      const data = response.data;
      // Filter to only include unapproved payments
      const unapprovedPayments = data.filter(payment => payment.department_id !== null);

      if (unapprovedPayments.length === 0) {
        setNoDepartmentessage('لا يوجد طلبات شراء');
        setDepartmentOrder([]);
      } else {
        setDepartmentOrder(unapprovedPayments);
        setNoDepartmentessage('');
      }
    } catch (error) {
      console.log(`Error getting data from backend: ${error}`);
      setNoDepartmentessage('حدث خطأ أثناء جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseOrder = async () => {
    setLoading(true);
    setNoCoursesMessage(''); 
    
    try {
      const response = await axios.get(`${API_URL}/PaymentsDepartments/getpaymentdata`);
      const data = response.data;
      
      const coursePayments = data.filter(payment => payment.course_id !== null);

      if (coursePayments.length === 0) {
        setNoCoursesMessage('لا يوجد طلبات شراء');
        setCourseOrder([]);
      } else {
        setCourseOrder(coursePayments);
        setNoCoursesMessage('');
      }
    } catch (error) {
      console.log(`Error getting data from backend: ${error}`);
      setNoCoursesMessage('حدث خطأ أثناء جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionBankOrder = async () => {
    setLoading(true);
    setNoQuestionBankMessage(''); 
    
    try {
      const response = await axios.get(`${API_URL}/PaymentsDepartments/getpaymentdata`);
      const data = response.data;
      
      if (data.length === 0) {
        setNoQuestionBankMessage('لا يوجد طلبات شراء لبنك الأسئلة');
        setQuestionBankOrder([]);
      } else {
        setQuestionBankOrder(data);
        setNoQuestionBankMessage('');
      }
    } catch (error) {
      console.log(`Error getting question bank data: ${error}`);
      setNoQuestionBankMessage('حدث خطأ أثناء جلب بيانات بنك الأسئلة');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentOrder();
    fetchCourseOrder();
    fetchQuestionBankOrder();
  }, []);

  const handleDeleteOrder = async () => {
    try {
      await axios.delete(`${API_URL}/PaymentsDepartments/delete/payments/${currentId}`);
      
      // Update all three state arrays to remove the deleted item
      setDepartmentOrder((prevData) => prevData.filter((data) => data.id !== currentId));
      setCourseOrder((prevData) => prevData.filter((data) => data.id !== currentId));
      setQuestionBankOrder((prevData) => prevData.filter((data) => data.id !== currentId));
      
      Toastify({
        text: "تم حذف الطلب بنجاح",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#F57D20",
      }).showToast();
      
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting order:", error);
      Toastify({
        text: "حدث خطأ أثناء حذف الطلب",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#FF0000",
      }).showToast();
    }
  }; 

  return (
    <>
      <NavBar title={"طلبات الشراء "} />
      <div className="container text-center">
        <div className="row">
          <div className="col-lg-6 col-md-12 col-sm-12 mb-4">
            <div className="d-flex cont_btn_order">
              <button
                className="courses_dep px-3 py-3 background_btn"
                style={{ backgroundColor: getButtonColor("btn1") }}
                onClick={() => handleClick("btn1")}
              >
                المواد
              </button>
              <button
                className="courses_dep px-3 py-3 background_btn"
                style={{ backgroundColor: getButtonColor("btn2") }}
                onClick={() => handleClick("btn2")}
              >
                الاقسام
              </button>
              <button
                className="courses_dep px-3 py-3 background_btn"
                style={{ backgroundColor: getButtonColor("btn3") }}
                onClick={() => handleClick("btn3")}
              >
                بنك الاسئلة
              </button>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12"></div>
        </div>
        <div className="row">
          {activeButton === "btn1" ? (
            <Table striped hover>
              <thead>
                <tr className="table_head_cardprice">
                  <th className="desc_table_cardprice">اسم الطالب</th>
                  <th className="desc_table_cardprice">الايميل</th>
                  <th className="desc_table_cardprice">العنوان</th>
                  <th className="desc_table_cardprice">رقم الهاتف</th>
                  <th className="desc_table_cardprice">اسم المادة</th>
                  <th className="desc_table_cardprice">رمز الكوبون</th>
                  <th className="desc_table_cardprice">الاجراء</th>
                </tr>
              </thead>
              {loading ? (
                <div className="spinner-container">
                  <Spinner animation="border" variant="warning" />
                </div>
              ) : noCoursesMessage ? (
                <div className="no-data-message">
                  <p>{noCoursesMessage}</p>
                </div>
              ) : (
                <tbody>
                  {courseOrder.map((course) => (
                    <tr key={course.id}>
                      <td>{course.student_name}</td>
                      <td>{course.email}</td>
                      <td>{course.address}</td>
                      <td>{course.phone}</td>
                      <td>{course.course.subject_name}</td>
                      <td>{course.Coupon?.coupon_code || '-'}</td>
                      <td>
                        <i
                          className="fa-regular fa-trash-can fa-lg"
                          style={{ color: "#944b43", cursor: "pointer" }}
                          onClick={() => handleOpenModal(course.id)}
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </Table>
          ) : activeButton === "btn2" ? (
            <Table striped hover>
              <thead>
                <tr className="table_head_cardprice">
                  <th className="desc_table_cardprice">اسم الطالب</th>
                  <th className="desc_table_cardprice">الايميل</th>
                  <th className="desc_table_cardprice">العنوان</th>
                  <th className="desc_table_cardprice">رقم الهاتف</th>
                  <th className="desc_table_cardprice">القسم</th>
                  <th className="desc_table_cardprice">رمز الكوبون</th>
                  <th className="desc_table_cardprice">الاجراء</th>
                </tr>
              </thead>
              {loading ? (
                <div className="spinner-container">
                  <Spinner animation="border" variant="warning" />
                </div>
              ) : noDepartmentMessage ? (
                <div className="no-data-message">
                  <p>{noDepartmentMessage}</p>
                </div>
              ) : (
                <tbody>
                  {departmentOrder.map((department) => (
                    <tr key={department.id}>
                      <td>{department.student_name}</td>
                      <td>{department.email}</td>
                      <td>{department.address}</td>
                      <td>{department.phone}</td>
                      <td>{department.Department.title}</td>
                      <td>{department.Coupon?.coupon_code || '-'}</td>
                      <td>
                        <i
                          className="fa-regular fa-trash-can fa-lg"
                          style={{ color: "#944b43", cursor: "pointer" }}
                          onClick={() => handleOpenModal(department.id)}
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </Table>
          ) : activeButton === "btn3" ? (
            <Table striped hover>
              <thead>
                <tr className="table_head_cardprice">
                  <th className="desc_table_cardprice">اسم الطالب</th>
                  <th className="desc_table_cardprice">الايميل</th>
                  <th className="desc_table_cardprice">العنوان</th>
                  <th className="desc_table_cardprice">رقم الهاتف</th>
                  <th className="desc_table_cardprice">رمز الكوبون</th>
                  <th className="desc_table_cardprice">الاجراء</th>
                </tr>
              </thead>
              {loading ? (
                <div className="spinner-container">
                  <Spinner animation="border" variant="warning" />
                </div>
              ) : noQuestionBankMessage ? (
                <div className="no-data-message">
                  <p>{noQuestionBankMessage}</p>
                </div>
              ) : (
                <tbody>
                  {questionBankOrder.map((questionBank) => (
                    <tr key={questionBank.id}>
                      <td>{questionBank.student_name}</td>
                      <td>{questionBank.email}</td>
                      <td>{questionBank.address}</td>
                      <td>{questionBank.phone}</td>
                      <td>{questionBank.Coupon?.coupon_code || '-'}</td>
                      <td>
                        <i
                          className="fa-regular fa-trash-can fa-lg"
                          style={{ color: "#944b43", cursor: "pointer" }}
                          onClick={() => handleOpenModal(questionBank.id)}
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </Table>
          ) : null}
        </div>
      </div>
      <DeletePopUp
        show={smShow}
        onHide={handleCloseModal}
        title={titlePopup}
        description={descriptionPopup}
        handleDelete={handleDeleteOrder}
      />
    </>
  );
}

export default Order;