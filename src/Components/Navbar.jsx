import Button from "./Button"
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect,useState } from "react";
import { FaTimes,FaBars } from "react-icons/fa";
import Register from "../pages/Register/Register";
import { Link } from "react-router-dom";


function Navbar() {

    const navData = [
        {label:"Home", href:"#", target:"_self"},
        {label: "About Us", href:"#", target:"_self"},
        {label: "Contact Us", href:"#", target:"_self"},
        {label: "Docs", href:"#", target:"_self"}
    ]

    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    },[]);


    return(
        <div className="navbar fixed-top" style={{height:'72px', width:'100%', backgroundColor: scrolled ? "white":"#212121"}}>
            <div className="container-lg">
                <div className="d-flex flex-row justify-content-between align-items-center">
                    <h3 style={{color: scrolled ? "black":"white"}}>Bₗₒgᵢfy</h3>
                </div>
                <div className="d-none d-lg-flex flex-row justify-content-center align-items-center" style={{gap:'1.5rem'}}>
                    {navData.map((value, index) => (
                        <a href={value.href} style={{color:scrolled ? "black" : "white"}} className="text-decoration-none" target={value.target}>{value.label}</a>
                    ))}
                    {/* <a href="#" target="_self">Home</a>
                    <a href="#" target="_self">About Us</a>
                    <a href="#" target="_self">Contact Us</a>
                    <a href="#" target="_self">Docs</a> */}
                </div>
                <div className="d-none d-lg-flex flex-row justify-content-end align-items-center" style={{gap:'20px', paddingRight: '20px'}}>
                    <Link to="/signup">
                        <Button label={"LOG IN"} style={{backgroundColor: scrolled ? "white":"#212121", color: scrolled ? "black":"white"}} bootstrap= "btn btn-dark"/>
                    </Link>
                    <Button label={"BLOCKS"} style={{backgroundColor: scrolled ? "black":"white", color: scrolled ? "white":"black"}} bootstrap= "btn btn-dark"/>
                </div>
                <div className="d-lg-none">
                    <button className="btn" style={{color: scrolled ? "black" : "white"}} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <FaTimes size={24}/> : <FaBars size={24}/>}</button>
                </div>
                <div
                    className={`d-lg-none position-absolute top-100 start-50 translate-middle-x`}
                    style={{
                        zIndex: 1000,
                        width: scrolled ? '100%' : '90%',
                        maxWidth: "800px",
                        transition: "all 0.3s ease-in-out",
                        transform: menuOpen ? "translateY(0)" : "translateY(-20px)",
                        opacity: menuOpen ? 1 : 0,
                        pointerEvents: menuOpen ? "auto" : "none",
                    }}
                    >
                    <div
                        className={`rounded shadow p-3`}
                        style={{
                        backgroundColor: "white",
                        color: "black"
                        }}
                    >
                        {navData.map((value, index) => (
                        <a
                            key={index}
                            href={value.href}
                            className="d-block mb-2 text-decoration-none"
                            style={{ color: "black" }}
                            target={value.target}
                            onClick={() => setMenuOpen(false)}
                        >
                            {value.label}
                        </a>
                        ))}

                        <div className="mt-3 d-flex gap-2">
                        <Button
                            onClick={Register}
                            label={"LOG IN"}
                            style={{
                            backgroundColor: "white",
                            color: "black"
                            }}
                            bootstrap="btn btn-dark"
                        />
                        <Button
                            label={"BLOCKS"}
                            style={{
                            backgroundColor: "black",
                            color: "white"
                            }}
                            bootstrap="btn btn-dark"
                        />
                        </div>
                    </div>
                </div>
            </div>
       </div>
    )
}

export default Navbar;