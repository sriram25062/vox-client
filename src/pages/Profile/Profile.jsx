import Button from "../../Components/Button.jsx";
import Card from "../../Components/Card.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from "react";
import { API_URL } from '../../api';
import SideNavbar from "../../Components/SideNavbar.jsx";


function Profile() {

    const cardData = [
    {title:"Hydrogen-Powered Vehicles",img:"/blog-1.jpg",description:"This article delves into the cutting-edge technology behind hydrogen fuel cells and their environmental benefits."},
    {title:"Mental Health in the Digital Age",img:"/blog-2.jpg",description:"This article explores the intricate relationship between social media usage and mental health"},
    {title:"Mars Colonization and Beyond",img:"/blog-3.jpg",description:"This article takes readers on a journey through the latest developments in space exploration."}
    ];

    const insights = [
      {count:"323", label:"Posts"},
      {count:"3.5k", label:"Followers"},
      {count:"260", label:"Following"},
    ];


    useEffect(() => {
        fetch(`${API_URL}/user/find`)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
          })
          .catch((err) => console.error(err));
    },[]);

    
  return (
    <div className="d-flex">
      <div>
        <SideNavbar/>
      </div>
      <div className="overflow-auto" style={{height:"100vh"}}>
        <div style = {{background: "linear-gradient(135deg, #0f0f0f, #1a1a1a, #0d0d0d)", width:"100%", height:"355px"}}></div>
        <div className="container">
            <div className="d-flex flex-column" style={{width:"100%", padding:"0% 16%", gap:"1rem", transform:"translateY(-100px)"}}>
            <img src="/avatar1.jpg" alt="profile" style={{height:"auto", width:"10rem", borderRadius:".75rem"}}/><br/>
            <div className="d-flex justify-content-between">
                <h3>Emma Roberts</h3>
                <Button label={"Follow"} style={{backgroundColor:"#212121"}} bootstrap= "btn btn-dark"/>
            </div>
            <div className="d-flex flex-wrap" style={{gap:"20px"}}>
                {insights.map((insight) => (
                <div className="d-flex" style={{gap:"10px", font:"16px Roboto,sans-serif"}}>
                    <strong>{insight.count}</strong>
                    <span style={{color:"#9E9E9E"}}>{insight.label}</span>
                </div>
                ))}
            </div>
            <p style={{color:"#9E9E9E", font:"20px Roboto,sans-serif"}}>A wordsmith who believes in the power of language to shape our world, inspire change, and connect us all. I bring a unique perspective to the writing, blending the knowledge and experiences into thought-provoking narratives.</p>
            <Button label={"MORE ABOUT ME →"} style={{backgroundColor:"white", color:"black", width:"fit-content"}} bootstrap= "btn btn-dark"/>
            </div><br/><br/><br/><br/>
            <div className="container my-5">
            <h3  className="fw-semibold" style={{font:"30px Roboto,sans-serif", color:"black"}}>Check my latest blog posts</h3>
                <div className="row g-4">
                {cardData.map((card,index) => (
                    <div className="col-12 col-md-6 col-lg-3" key={index}>
                    <Card
                    key = {index}
                    title={card.title}
                    img={card.img}
                    description={card.description}
                    />
                    </div>
                ))}
                <div className="col-12 col-md-6 col-lg-3">
                    <div className="d-flex flex-column justify-content-center h-100" style={{backgroundColor:"black", color:"white", padding:"24px", gap:"20px", borderRadius:"8px"}}>
                    <h3 className="fw-semibold" style={{font:"30px Roboto,sans-serif"}} >Discover all my articles</h3>
                    <p style={{font:"16px Roboto,sans-serif"}}>I am a versatile writer who explores a wide range of genres and topics.</p>
                    </div>
                </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;