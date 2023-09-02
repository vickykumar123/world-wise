import styles from "./CountryItem.module.css";

function CountryItem({ countryObj }) {
  return (
    <li className={styles.countryItem}>
      <span>{countryObj.emoji}</span>
      <span>{countryObj.country}</span>
    </li>
  );
}

export default CountryItem;
