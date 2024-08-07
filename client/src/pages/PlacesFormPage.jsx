import { useEffect, useState } from "react";
import Perks from "../Perks";
import PhotosUploader from "../PhotosUploader";
import axios from "axios";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";

export default function PlacesFormPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState(false);
  const [price, setPrice] = useState(100);

  useEffect(() => {
    if (!id) {
      return;
    } else {
      axios.get("/places/" + id).then((response) => {
        const { data } = response;
        setTitle(data.title);
        setAddress(data.address);
        setDescription(data.description);
        setAddedPhotos(data.photos);
        setPerks(data.perks);
        setExtraInfo(data.extraInfo);
        setCheckIn(data.checkIn);
        setCheckOut(data.checkOut);
        setMaxGuests(data.maxGuests);
        setPrice(data.price);
      });
    }
  }, [id]);
  async function savePlace(event) {
    event.preventDefault();
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };
    if (id) {
      //Update
      await axios.put("/places", {
        id,
        ...placeData,
      });
      setRedirect(true);
    } else {
      await axios.post("/places", placeData);
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }
  return (
    <>
      <AccountNav />
      <div className="new-place">
        <form onSubmit={savePlace}>
          <h2 className="text-xl mt-4 ">Title</h2>
          <input
            type="text"
            className=""
            placeholder="Title, for example: Greymore Villa"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
          <h2 className="text-xl mt-4 ">Address</h2>
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(ev) => setAddress(ev.target.value)}
          />
          <h2 className="text-xl mt-4 ">Photos</h2>

          <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

          <div>
            <h2 className="text-xl mt-4 ">Description</h2>
            <textarea
              type="text"
              placeholder="Describe the accomodation..."
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
            />
          </div>
          <div>
            <h2 className="text-xl mt-4 ">Perks</h2>
            <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <Perks selected={perks} onChange={setPerks} />
            </div>
          </div>
          <div>
            <h2 className="text-xl mt-4 ">Extra Info</h2>
            <textarea
              type="text"
              placeholder="House Rules etc..."
              value={extraInfo}
              onChange={(ev) => setExtraInfo(ev.target.value)}
            />
          </div>
          <div>
            <h2 className="text-xl mt-4">Check In & Out Times, Max Guests</h2>
            <div className="grid grid-cols-3 gap-6 mt-2">
              <div>
                <h3>Check-In Time</h3>
                <input
                  type="text"
                  placeholder="14:00"
                  value={checkIn}
                  onChange={(ev) => setCheckIn(ev.target.value)}
                />
              </div>
              <div>
                <h3>Check-Out Time</h3>
                <input
                  type="text"
                  placeholder="14:00"
                  value={checkOut}
                  onChange={(ev) => setCheckOut(ev.target.value)}
                />
              </div>
              <div>
                <h3>Maximum Guests</h3>
                <input
                  type="number"
                  placeholder="6"
                  value={maxGuests}
                  onChange={(ev) => setMaxGuests(ev.target.value)}
                />
              </div>
              <div>
                <h3>Price per night</h3>
                <input
                  type="number"
                  placeholder="6"
                  value={price}
                  onChange={(ev) => setPrice(ev.target.value)}
                />
              </div>
            </div>
          </div>
          <div>
            <button className="primary mt-4">Save</button>
          </div>
        </form>
      </div>
    </>
  );
}
