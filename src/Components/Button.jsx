import 'bootstrap/dist/css/bootstrap.min.css';

function Button({label, style, onClick, bootstrap}) {
    return(
        <button style={style} onClick={onClick} className={bootstrap}>{label}</button>
    )
}

export default Button;

// className="btn btn-dark"