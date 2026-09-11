
import WeatherPage from "@/components/Pages/WeatherPage/WeatherPage";
import PrivateComponent from "@/components/Reusable/PrivateComponent";

const Page = () => {
  return (
    <PrivateComponent feature="WEATHER">
      <WeatherPage />
    </PrivateComponent >
  );
};

export default Page;
