function Card({title, img, description}) {
    return(
        <div className="card h-100 shadow-sm">
            <img src = {img} alt = "Blog" className="card-img-top img-fluid"/>
            <div  className="card-body">
                <h2 className="card-title">{title}</h2>
                <p className="card-text">{description}</p>
            </div>
        </div>
    ); 
}

export default Card;