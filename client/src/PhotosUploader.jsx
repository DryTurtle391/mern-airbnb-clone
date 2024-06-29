import axios from "axios";
import { useState } from "react";

export default function PhotosUploader({ addedPhotos, onChange }) {
  const [photoLink, setPhotoLink] = useState("");

  async function addPhotoByLink(event) {
    event.preventDefault();
    const { data: filename } = await axios.post("/upload-by-link", {
      link: photoLink,
    });

    onChange((prev) => {
      return [...prev, filename];
    });
    setPhotoLink("");
  }

  function uploadPhtotos(event) {
    event.preventDefault();
    const files = event.target.files;
    console.log(files);
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    axios
      .post("/upload", data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filenames } = response;
        onChange((prev) => {
          return [...prev, ...filenames];
        });
      });
  }

  return (
    <>
      <div className="flex gap-2 items-center">
        <input
          value={photoLink}
          onChange={(ev) => setPhotoLink(ev.target.value)}
          type="text"
          placeholder="Add using link...   .jpg"
        />
        <button
          onClick={addPhotoByLink}
          className="bg-gray-200 rounded-full px-4 py-3"
        >
          Add&nbsp;Photo
        </button>
      </div>
      <div className=" mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        <label className="h-32 cursor-pointer flex justify-center items-center gap-2 border bg-transparent text-xl rounded-2xl p-8  text-gray-500">
          <input
            type="file"
            className="hidden"
            onChange={uploadPhtotos}
            multiple
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
          Upload
        </label>
        {addedPhotos.length > 0 &&
          addedPhotos.map((link) => (
            <div className="h-32 flex" key={link}>
              <img
                className="rounded-2xl w-full object-cover"
                src={"http://localhost:4000/uploads/" + link}
                alt=""
              />
            </div>
          ))}
      </div>
    </>
  );
}
