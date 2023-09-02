import { NavLink, Outlet, useParams } from "react-router-dom";
import style from "./PageNav.module.css";
import Logo from "./Logo";

export default function PageNav() {
  const params = useParams();
  console.log(params);

  return (
    <>
      <nav className={style.nav}>
        <Logo />
        <ul>
          <li>
            <NavLink to="/pricing">Pricing</NavLink>
          </li>
          <li>
            <NavLink to="/products">Products</NavLink>
          </li>
          <li>
            <NavLink to="/login" className={style.ctaLink}>
              Login
            </NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}
