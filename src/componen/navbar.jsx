import Logo from "../../public/navbar-brand.svg";
function Navbar() {
  return (
    <div>
      <div className="logo-container">
        <img
          src={Logo} // Gantilah dengan path sesuai lokasi logo Anda
          alt="Politeknik Negeri Banyuwangi"
          className="poltek-logo"
        />
      </div>
    </div>
  );
}

export default Navbar;
