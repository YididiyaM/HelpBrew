import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router";
import Api from "../../../api/Api";
import ImageUploader from "../molecules/ImageUploader";
import Map from "../molecules/Map";
import { useNotification } from "../../notifications/NotificationProvider";
import axios from "axios";
import { GrMapLocation } from "react-icons/gr";
import MaterialUiCalendar from "../../Calendar/MaterialUiCalendar";
import giveAwayscreate from "../../../assets/createPost.png";
import Warning from "../../notifications/Warning";

//Displays the form for creation of a new post by user
function NewGiverPost({ posts, setPosts, user }) {
  const history = useHistory();
  const location = useLocation();
  const [imgUrl, setImgUrl] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [details, setDetails] = useState("");
  const [uploading, setUploading] = useState(true);
  const [postCategory, setPostCategory] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState([]);
  const [displayError, setDisplayError] = useState(false);
  const [eventCapacity, setEventCapacity] = useState(1);

  /* calendar related hook */
  const now = new Date().toString();
  const [selectedDateAndTime, setSelectedDateAndTime] = useState(now);

  const canBeSubmitted = () => {
    return postCategory === "giveaways"
      ? imgUrl !== undefined &&
          imgUrl.length > 0 &&
          address.length > 0 &&
          postTitle.length > 0 &&
          details.length > 0
      : imgUrl !== undefined &&
          imgUrl.length > 0 &&
          postTitle.length > 0 &&
          details.length > 0;
  };

  const getAll = () => {
    Api.get("/posts").then((res) => {
      setPosts(res.data);
    });
  };

  const handleSubmit = (e) => {
    setAddress(locationInput);
    e.preventDefault();
  };

  const dispatch = useNotification();
  const handleNewNotification = () => {
    dispatch({
      type: "SUCCESS",
      message: "Posted!",
    });
  };

  const submitHandler = (event) => {
    handleNewNotification();
    event.preventDefault();
    const newPost = {
      body: details,
      claimed: false,
      imageUrl: imgUrl,
      title: postTitle,
      date: format(new Date(), "dd-MM-yyyy"),
      category: postCategory,
      postType: location.state.type,
      location: address,
      position: position,
      user: user,
      meetingTimeAndDate: selectedDateAndTime,
      eventCapacity: eventCapacity,
    };

    Api.post("/posts", newPost).then((res) => {
      getAll();

      setPosts([...posts, res.data]);

      history.push(`/posts/category/${postCategory}`);
    });
  };

  // The geocoder api used in this components requires the address string to be at least 3 characters long.
  // That is when a request to the api will be made.
  useEffect(() => {
    if (address.length >= 3) {
      fetchPosition();
    }
  }, [address]);

  //The geocoder api positionstack allows to convert address string into lat, lng coordinates,
  //which can the be passed to Map component for map display.
  async function fetchPosition() {
    let fetched = false;
    while (!fetched) {
      try {
        const response = await axios.get(
          `http://api.positionstack.com/v1/forward?access_key=26f92b100e63df8995a3669559ae5d78&query=${address}&limit=10&output=json`
        );

        setPosition([
          response.data.data[0].latitude,
          response.data.data[0].longitude,
        ]);
        fetched = true;
        setDisplayError(false);
        return;
      } catch (err) {
        setDisplayError(true);
        setPosition([]);
        return;
      }
    }
  }

  return (
    <div className="create-container">
      <form className="createcard" onSubmit={submitHandler}>
        <div className="card-body">
          <div className="page-title">
            <h1>OFFER HELP</h1>
          </div>
          <ImageUploader setUploading={setUploading} setImgUrl={setImgUrl} />

          <label className="custom-field">
            <select
              required
              name="category"
              className={`${
                postCategory.length > 0 ? "card-input" : "waitInput"
              }`}
              onChange={(e) => {
                setPostCategory(e.target.value);
              }}
            >
              <option className="option-placeholder" disabled selected>
                Choose Category
              </option>
              <option className="option-placeholder" value="giveaways">
                Giveaways
              </option>
              <option value="skills">Skills</option>
              <option value="monetary-support">Monetary Support</option>
            </select>
          </label>

          <label className="custom-field">
            <input
              type="text"
              required
              // className="card-input"
              className={`${postTitle.length > 0 ? "card-input" : "waitInput"}`}
              onChange={(e) => setPostTitle(e.target.value)}
            />
            <span className="placeholder">Enter Title </span>
          </label>

          <label className="custom-field">
            <textarea
              type="text"
              required
              className={`${details.length > 0 ? "card-input" : "waitInput"}`}
              //className="card-input"
              rows="10"
              onChange={(e) => setDetails(e.target.value)}
            />
            <span className="placeholder">Enter Details</span>
          </label>

          {/* Depending on the category chosen by user from drop-down menu,
            a field for entering a pick-up location will be displayed or not */}
          {postCategory === "giveaways" ? (
            /* The field allows user to enter a pick-up location for giveaway posts and search for
              it on the map when the button Find location is pushed */

            <label className="location-field">
              <input
                type="text"
                required
                placeholder="Pick-Up Location"
                className={`${
                  locationInput.length > 0 ? "location-input" : "waitInput"
                }`}
                onChange={(e) => setLocationInput(e.target.value)}
              />

              <button
                type=""
                className="location-input-button"
                onClick={handleSubmit}
              >
                <GrMapLocation size="20px" />
              </button>
            </label>
          ) : null}

          {/* Depending on the category chosen by user from drop-down menu,
            a field for entering a pick-up location will be displayed or not */}
          {postCategory === "skills" ? (
            <label className="custom-field">
              <input
                type="text"
                required
                className={`${
                  eventCapacity.length > 0 ? "card-input" : "waitInput"
                }`}
                onChange={(e) => setEventCapacity(e.target.value)}
              />
              <span className="placeholder">Number of spots</span>
            </label>
          ) : null}

          {postCategory === "skills" ? (
            <MaterialUiCalendar
              selectedDateAndTime={selectedDateAndTime}
              setSelectedDateAndTime={setSelectedDateAndTime}
            />
          ) : null}

          <div>
            <button
              className="medium-button"
              disabled={!canBeSubmitted() ? true : false}
              type="submit"
            >
              Submit
            </button>
          </div>

          {/* Displays error if API could not fetch location coordinates or any other error happenned */}
          {displayError ? (
            <Warning
              message={
                "Something went wrong. Please check the entered location and try again."
              }
              setDisplayError={setDisplayError}
            />
          ) : null}
        </div>
      </form>
      {/* Displays Map if coordinates(position) of the address searched above have been fetched */}

      <div className="map">
        {address.length > 0 && position.length > 0 ? (
          <Map position={position} />
        ) : (
          <div className="right">
            <img
              src={giveAwayscreate}
              className="help-image"
              alt="give with love"
            />
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
}

export default NewGiverPost;
