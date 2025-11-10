import Button from "../../Components/Button.jsx";
import Card from "../../Components/Card.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import SideNavbar from "../../Components/SideNavbar.jsx"
import { useState, useEffect, useRef } from "react";
import { API_URL } from '../../api';
import "./Home.css";

function Home() {

    const cardData = [
    {title:"Hydrogen-Powered Vehicles",img:"/blog-1.jpg",description:"This article delves into the cutting-edge technology behind hydrogen fuel cells and their environmental benefits."},
    {title:"Mental Health in the Digital Age",img:"/blog-2.jpg",description:"This article explores the intricate relationship between social media usage and mental health"},
    {title:"Mars Colonization and Beyond",img:"/blog-3.jpg",description:"This article takes readers on a journey through the latest developments in space exploration."}
    ];

  const [users, setUsers] = useState([]);
  const [searched, setSearched] = useState("");
  const isFirstRun = useRef(true);



    useEffect(() => {

      const fetchUsers = async () => {
        try {
          let baseUrl = `${API_URL}/user/find`;

          if (searched.trim() !== "") {
            baseUrl = `${baseUrl}?username=${encodeURIComponent(searched.trim())}`;
          }
          console.log(baseUrl);
          const response = await fetch(baseUrl);
          console.log("response", response)
          const data = await response.json();
          console.log("data", data)
          setUsers(data.userList || []);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      // On first render: fetch immediately. On subsequent changes to `searched`, debounce the fetch.
      if (isFirstRun.current) {
        fetchUsers();
        isFirstRun.current = false;
        return;
      }

      const handler = setTimeout(() => {
        fetchUsers();
      }, 500);

      return () => clearTimeout(handler);
    }, [searched]);
    
  return (
    <div className="d-flex" style={{height:"100vh", width:"100vw"}}>
      <div className="position-fixed top-0 start-0 vh-100" style={{width:"25%"}}>
        <SideNavbar/>
      </div>
      <div className="overflow-auto d-flex flex-column" style = {{width:"75%", marginLeft:"25%", height:"100vh", background: "linear-gradient(135deg, #0f0f0f, #1a1a1a, #0d0d0d)"}}>
        <div className="d-flex position-sticky top-0" style={{zIndex: 999, width:"100%"}}>
          <div className="d-flex" style={{width:"70%", color:"white", background: "linear-gradient(135deg, #0f0f0f, #1a1a1a, #0d0d0d)"}}>
            <Button label={"For you"} style={{width:"50%", fontWeight:"600", backgroundColor: "white", color: "black"}} bootstrap= "btn btn-dark"/>
            <Button label={"Following"} style={{width:"50%", fontWeight:"600", backgroundColor: "white", color: "black"}} bootstrap= "btn btn-dark"/>
          </div>
          <div style={{width:"30%"}}>
            <div className="position-relative w-100">
            <input
              type="text"
              className="form-control rounded-pill ps-5 custom-input"
              placeholder="Search"
              style={{backgroundColor: "white", border: "none" }}
              onChange= { (e) => {setSearched(e.target.value)}}
            />
            <i
              className="bi bi-search position-absolute top-50 start-0 translate-middle-y ps-3"
              style={{ fontSize: "18px" }}
            ></i>
            </div>
          </div>
        </div>
        <div className="d-flex">
          <div className="d-flex flex-column" style={{height:"100%", width:"70%"}}>
            <div>
              <textarea placeholder="What's happening?" rows={4} style={{ width:"100%"}}></textarea>
            </div>
            <div>
              {cardData.map((card,index) => (
                <div>
                  <Card
                  key = {index}
                  title={card.title}
                  img={card.img}
                  description={card.description}
                  />
                </div>
              ))}
            </div>
          </div>
          <div style={{ width:"30%", height:"100%"}}>
            <div style={{ overflowY: "auto"}}>
              <h5 className="text-light">You might like...</h5>
              <hr className="text-light" />

              {users.length === 0 ? (
                <p className="text-secondary">No users found</p>
              ) : (
                users.map((user, index) => (
                  <div
                    key={index}
                    className="p-2 mb-2 rounded"
                    style={{ backgroundColor: "#212121", color: "white" }}
                  >
                    <p className="mb-1 fw-bold">{user.fullname || "Unnamed User"}</p>
                    <p className="mb-0 small text-secondary">{user.username || "No username"}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div> 
    </div>  
  );
}

export default Home;