import Button from "../../Components/Button.jsx";
import Card from "../../Components/Card.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../../Components/Navbar.jsx";
import { useEffect } from "react";
import { API_URL } from '../../api';


function Template() {

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

    const footer = [
      {label:"Company", href:"#", target:"_self"},
      {label:"About Us", href:"#", target:"_self"},
      {label:"Team", href:"#", target:"_self"},
      {label:"Product", href:"#", target:"_self"},
      {label:"Blog", href:"#", target:"_self"},
      {label:"Pricing", href:"#", target:"_self"}
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
    <div>
      <Navbar/>
      <div style = {{backgroundColor:"#212121", width:"100%", height:"355px"}}></div>
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
        </div><br/><br/><br/><br/><br/><br/><br/><br/>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <h1 style={{font:"48px Roboto,sans-serif", color:"#263238"}}>Say Hi!</h1>
          <p style={{font:"20px Roboto,sans-serif", color:"#9e9e9e"}}>Any questions or remarks? Just write us a messaage!</p>
        </div><br/><br/><br/>
        <div className="container-fluid" style={{padding:"0% 5%"}}>
          <div className="d-flex shadow mb-5 bg-body-tertiary rounded" style={{padding:"3.5% 3.5% 3.5% 6.5%", gap:"15%"}}>
            <form className="d-flex flex-column" style={{gap:"10px"}}>
              <div className="d-flex" style={{gap:"10px"}}>
                <div className="flex-fill">
                  <label for="firstname" className="form-label">First Name</label>
                  <input id="firstname" type="text" className="form-control" placeholder="eg. Lucas"/>
                </div>
                <div className="flex-fill">
                  <label for="lastname" className="form-label">Last Name</label>
                  <input id="lastname" type="text" className="form-control" placeholder="eg. Jones"/>
                </div>
              </div>
              <div><br/>
                <label for="email" className="form-label">Email</label>
                <input id="email" type="email" className="form-control" placeholder="eg. lucas@mail.com"/>
              </div>
              <div><br/>
                <label for="message" className="form-label">Your Message</label>
                <textarea id="message" type="text" className="form-control" style={{height:"100px"}}/>
              </div><br/><br/><br/><br/>
              <div className="d-flex justify-content-end"style={{width:"100%"}}>
                <Button label={"SEND MESSAGE"} style={{backgroundColor:"black", color:"white", padding:"12px 24px", font:"12px Roboto,sans-serif"}} bootstrap= "btn btn-dark"/>
              </div>
            </form>
            <div className="d-flex flex-column justify-content-start" style={{padding:"6%", backgroundColor:"black"}}>
              <h4 style={{font:"24px Roboto,sans-serif", color:"white", margin:"0px 0px 8px"}}><b>Contact Information</b></h4>
              <p style={{font:"16px Roboto,sans-serif", color:"#9e9e9e", margin:"0px 0px 32px"}}>Fill up the form and our Team will get back to you within 24 hours.</p>
              <h6 style={{font:"16px Roboto,sans-serif", color:"white", margin:"0px 0px 8px"}}><b>+1(424) 535 3523</b></h6>
              <h6 style={{font:"16px Roboto,sans-serif", color:"white", margin:"0px 0px 8px"}}><b>Open Support Ticket</b></h6>
              <h6 style={{font:"16px Roboto,sans-serif", color:"white", margin:"0px 0px 8px"}}><b>hello@mail.com</b></h6>
            </div>
          </div>
        </div><br/><br/><br/><br/>
      </div>
      <footer>
        <div className="d-flex flex-column" style={{gap:"125px"}}>
          <div className="d-flex justify-content-center flex-wrap" style={{gap:"50px"}}>
            {footer.map((value) => (
              <a href={"value.href"} style={{font:"16px Roboto,sans-serif", color:"#616161"}} className="text-decoration-none" target={"value.target"}>{value.label}</a>
              ))}
          </div>
          <div className="d-flex justify-content-center">
            <p style={{font:"16px Roboto,sans-serif", color:"#616161"}}>© 2025 Made with Material Tailwind by Creative Tim.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Template;