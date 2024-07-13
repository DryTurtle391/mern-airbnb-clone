import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  useEffect(() => {
    if (!id) {
      return;
    }

    axios.get(`/places/${id}`).then((response) => {
      setPlace(response.data);
    });
  }, [id]);

  if (!place) return "";

  if (showAllPhotos) {
    return (
      <div>
        <div className=" absolute bg-black text-white inset-0">
          <div className="bg-black p-8 grid gap-4">
            <h2 className="text-3xl">{place.title} Photos</h2>
            <button
              className="flex gap-1 fixed top-2 right-2 bg-gray-100 px-2 py-1 rounded-2xl text-black shadow shadow-md shadow-white"
              onClick={() => setShowAllPhotos(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              Close Photos
            </button>
            {place?.photos?.length > 0 &&
              place.photos.map((photo) => (
                <div>
                  <img src={"http://localhost:4000/uploads/" + photo} alt="" />
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 -ml-2 rounded-2xl bg-gray-100 py-4 px-6">
      <h1 className="text-3xl">{place.title}</h1>
      <a
        className="flex gap-1 my-2 block font-semibold underline"
        target="_blank"
        href={"https://maps.google.com/?q=" + place.address}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>

        {place.address}
      </a>
      <div className="relative">
        <div className="grid gap-2 grid-cols-[2fr_1fr] overflow-hidden rounded-2xl ">
          <div className="flex aspect-square">
            {place.photos?.[0] && (
              <img
                className="aspect-square object-cover"
                src={"http://localhost:4000/uploads/" + place.photos?.[0]}
                alt=""
              />
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex aspect-square">
              {place.photos?.[1] && (
                <img
                  className="object-cover"
                  src={"http://localhost:4000/uploads/" + place.photos?.[1]}
                  alt=""
                />
              )}
            </div>
            <div className="flex aspect-square">
              {place.photos?.[2] && (
                <img
                  className="object-cover"
                  src={"http://localhost:4000/uploads/" + place.photos?.[2]}
                  alt=""
                />
              )}
            </div>
          </div>
          <button
            onClick={() => setShowAllPhotos(!showAllPhotos)}
            className="flex gap-1 font-semibold absolute bottom-2 right-2 bg-white rounded-xl shadow shadow-2xl py-1 px-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            Show more photos
          </button>
        </div>
      </div>
      <div className="mt-4 ">
        <h2 className="font-semibold text-2xl">Description</h2>
        {place.description}
      </div>
    </div>
  );
}
