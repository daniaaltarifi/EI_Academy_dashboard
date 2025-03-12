import React, { useState, useEffect } from "react";
import NavBar from "../component/NavBar";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import "../Css/search.css";
import Table from "react-bootstrap/Table";
import DeletePopUp from "../component/DeletePopUp";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { API_URL } from "../App";

function TestBankPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [smShow, setSmShow] = useState(false);
  const [titlePopup, setTitlePopup] = useState("");
  const [descriptionPopup, setDescriptionPopup] = useState("");
  const [testBanks, setTestBanks] = useState([]);
  const [testBankCounts, setTestBankCounts] = useState({});
  const [currentId, setCurrentId] = useState(null);

  const navigate = useNavigate();

  const handleOpenModal = (id) => {
    setCurrentId(id);
    setSmShow(true);
    setTitlePopup("حذف بنك الأسئلة");
    setDescriptionPopup("هل أنت متأكد من حذف بنك الأسئلة هذا؟");
  };

  const handleCloseModal = () => {
    setSmShow(false);
  };

  const handleUpdate = (id) => {
    navigate("/updatetestbank", { state: { id } });
  };

  useEffect(() => {
    const fetchTestBanks = async () => {
      try {
        const response = await axios.get(`${API_URL}/testbank/gettestbank`);
        const data = response.data;
        setTestBanks(data);
        fetchStudentCountsTestBanks(data);
      } catch (error) {
        console.log(`Error getting data from backend: ${error}`);
      }
    };
    fetchTestBanks();
  }, []);

  const fetchStudentCountsTestBanks = async (testBanks) => {
    const counts = {};
    await Promise.all(
      testBanks.map(async (testBank) => {
        try {
          const response = await axios.get(
            `${API_URL}/testbank/users-counts/${testBank.id}`
          );
          counts[testBank.id] = response.data.student_count;
        } catch (error) {
          console.error(
            `Error fetching student count for test bank ${testBank.id}:`,
            error
          );
          counts[testBank.id] = 0; 
        }
      })
    );
    setTestBankCounts(counts);
  };

  const dataToDisplay = searchQuery ? searchResults : testBanks;

  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filteredResults = testBanks.filter((testBank) =>
      testBank.testBankCourse_name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

  const handleDelete = async () => {
    try {
      
      const response = await axios.delete(
        `${API_URL}/testbank/deletetestbank/${currentId}`
      );
      const { message, hasUsers } = response.data;

      if (hasUsers) {
        if (
          window.confirm(
            "هذا البنك لديه مستخدمين مرتبطين به. هل أنت متأكد من حذفه؟"
          )
        ) {
          await axios.delete(
            `${API_URL}/testbank/deletetestbank/${currentId}?force=true`
          );
          setTestBanks((prevData) =>
            prevData.filter((data) => data.id !== currentId)
          );
          Toastify({
            text: "تم حذف بنك الأسئلة بنجاح",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#F57D20",
          }).showToast();
        }
      } else {
        setTestBanks((prevData) =>
          prevData.filter((data) => data.id !== currentId)
        );
        Toastify({
          text: "تم حذف بنك الأسئلة بنجاح",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#F57D20",
        }).showToast();
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting test bank:", error);
      Toastify({
        text: "حدث خطأ أثناء حذف بنك الأسئلة",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#FF0000",
      }).showToast();
    }
  };

  return (
    <>
      <NavBar title={"بنك الأسئلة"} />
      <section className="margin_section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-12 col-sm-12">
              <Link to="/addtestbank">
                <Button className="add_btn">
                  <span className="plus_icon">+</span>
                  إضافة بنك أسئلة جديد
                </Button>
              </Link>
            </div>

            {/* search */}
            <div className="col-lg-6 col-md-12 col-sm-12">
              <div className="navbar__search">
                <span>
                  <i
                    className="fa-solid fa-magnifying-glass fa-sm"
                    style={{ color: "#018abe" }}
                  ></i>{" "}
                </span>
                <input
                  type="text"
                  placeholder="ابحث عن"
                  value={searchQuery}
                  className="search_blog"
                  onChange={handleInputChange}
                />
                <a
                  className="btn btn-s purple_btn search_btn_blog"
                  onChange={handleInputChange}
                >
                  بحث{" "}
                </a>
              </div>
              {/* End search */}
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <Table striped hover>
                <thead>
                  <tr className="table_head_cardprice">
                    <th className="desc_table_cardprice">اسم بنك الأسئلة</th>
                    <th className="desc_table_cardprice">المادة</th>
                    <th className="desc_table_cardprice">الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(dataToDisplay) &&
                    dataToDisplay.map((testBank) => (
                      <tr key={testBank.id}>
                        <td>{testBank.testBankCourse_name}</td>
                        <td>{testBank.semester}</td>
                        <td>
                          <i
                            className="fa-regular fa-pen-to-square fa-lg ps-2"
                            style={{ color: "#6dab93", cursor: "pointer" }}
                            onClick={() => handleUpdate(testBank.id)}
                          ></i>
                          <i
                            className="fa-regular fa-trash-can fa-lg"
                            style={{ color: "#944b43", cursor: "pointer" }}
                            onClick={() => handleOpenModal(testBank.id)}
                          ></i>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
        <DeletePopUp
          show={smShow}
          onHide={handleCloseModal}
          title={titlePopup}
          description={descriptionPopup}
          handleDelete={handleDelete}
        />
      </section>
    </>
  );
}

export default TestBankPage;