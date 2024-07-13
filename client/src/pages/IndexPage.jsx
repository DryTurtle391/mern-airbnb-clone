import { Link } from "react-router-dom";
import Layout from "../Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get("/places").then((response) => {
      setPlaces([
        ...response.data,
        ...response.data,
        ...response.data,
        ...response.data,
        ,
        ...response.data,
      ]);
    });
  }, []);
  return (
    <div className="mt-6 gap-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {places.length > 0 &&
        places.map((place) => (
          <div>
            <div className="bg-gray-500 rounded-2xl flex aspect-square">
              {place.photos?.[0] && (
                <img
                  className="rounded-2xl object-cover"
                  src={"http://localhost:4000/uploads/" + place.photos?.[0]}
                  alt=""
                />
              )}
            </div>
            <h3 className=" mt-2 text-sm font-bold leading-4">{place.title}</h3>
            <h2 className="text-sm truncate leading-4">{place.address}</h2>
            <div className="mt-1">
              <span className="font-bold">${place.price}</span> per night
            </div>
          </div>
        ))}
    </div>
  );
}
