import styles from "./CityList.module.css";
import CityItem from "./CityItem";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/cityContext";

export default function CityList() {
  const { cities, isLoading, onDelete } = useCities();
  if (isLoading) return <Spinner />;
  if (!cities.length)
    return <Message message="Add your first visit by clicking on the map" />;
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem cityObj={city} key={city.id} onDelete={onDelete} />
      ))}
    </ul>
  );
}
