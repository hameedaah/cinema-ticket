import { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const movies = [
    "Sola Olaniyi",
    "James Smith",
    "Ola Bode",
    "Susan Owolabi",
    "John Doe",
  ];

  const [movieData, setMovieData] = useState("");
  const [maxSeats, setMaxSeats] = useState("");
  const [movieCounters, setMovieCounters] = useState(() => {
    const initialCounters = [];
    for (let i = 0; i < movies.length; i++) {
      initialCounters.push(1);
    }
    return initialCounters;
  });

  const handleInputChange = (e) => {
    setMaxSeats((max) => (e.target.validity.valid ? e.target.value : max));
  };

  const handleStoreValue = () => {
    axios
      .post(`/api/cinema/set-seat/${maxSeats}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("res", res.data);
        setMaxSeats("");
      })
      .catch((error) => {
        console.log("err", error);
      });
  };

  const handleBookTicket = () => {
    const data = movies.map((movie, index) => ({
      movieTitle: "Extraction 2",
      price: 4000,
      requestedSeats: movieCounters[index],
      status: "processing",
    }));

    const promises = data.map((dataItem) =>
      axios.post(`/api/cinema/book`, dataItem, {
        headers: { "Content-Type": "application/json" },
      })
    );

    Promise.allSettled(promises)
      .then((results) => {
        const allResponses = results.map((result) => {
          console.log(result);
          if (result.status === "fulfilled") {
            return result.value.data;
          } else {
            return result.reason.response.data;
          }
        });
        setMovieData(allResponses);
        console.log("responses", allResponses);
      })
      .catch((error) => {
        console.log("err", error);
      });
  };

  const handleClear = () => {
    axios
      .get("/api/cinema/clear", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("res", res.data);
      })
      .catch((error) => {
        console.log("err", error);
      });
  };

  const UserComponent = ({ title, index }) => {
    const counter = movieCounters[index];

    const handleIncrement = () => {
      if (counter < 200) {
        const updatedCounters = [...movieCounters];
        updatedCounters[index] = counter + 1;
        setMovieCounters(updatedCounters);
      }
    };

    const handleDecrement = () => {
      if (counter > 1) {
        const updatedCounters = [...movieCounters];
        updatedCounters[index] = counter - 1;
        setMovieCounters(updatedCounters);
      }
    };

    return (
      <th className="ticket-card">
        <div className="row title">{title}</div>
        <hr></hr>
        <div className="row-btns">
          <button onClick={handleDecrement} disabled={counter <= 1}>
            <img
              src="https://cdn-icons-png.flaticon.com/128/43/43625.png"
              alt="decrease"
            />
          </button>
          <div className="text">{counter}</div>
          <button onClick={handleIncrement} disabled={counter >= 200}>
            <img
              src="https://cdn-icons-png.flaticon.com/128/748/748113.png"
              alt="increase"
            />
          </button>
        </div>
      </th>
    );
  };

  return (
    <div className="main-container">
      <h1 className="movie-title">Ticket Booking System: Extraction 2</h1>
      <div className="input-container">
        <label className="label" htmlFor="maxSeats">
          Set max seats:
        </label>
        <input
          type="text"
          id="maxSeats"
          value={maxSeats}
          onChange={handleInputChange}
          pattern="[0-9]*"
        />
        <button className="tickets-btn seats-btn" onClick={handleStoreValue}>
          Submit
        </button>
      </div>
      <div className="table-container">
        <table>
          <tr>
            <>
              {movieData.length > 0 && <td></td>}
              {movies.map((movie, idx) => (
                <UserComponent key={idx} title={movie} index={idx} />
              ))}
            </>
          </tr>
          {movieData.length > 0 && (
            <>
              <tr className="table-body">
                <td className="name">Request time</td>
                {movieData.map((item, idx) => {
                  return <td key={idx}>{item.requestTime}</td>;
                })}
              </tr>
              <tr className="table-body">
                <td className="name">Completion time</td>
                {movieData.map((item, idx) => {
                  return <td key={idx}>{item.completionTime}</td>;
                })}
              </tr>
              <tr className="table-body">
                <td className="name">Status</td>
                {movieData.map((item, idx) => {
                  return <td key={idx}>{item.status}</td>;
                })}
              </tr>
            </>
          )}
        </table>
      </div>
      <div className="tickets-btn-container">
        <button onClick={handleBookTicket} className="tickets-btn">
          Book Tickets
        </button>
        <button onClick={handleClear} className="tickets-btn clear">
          Clear
        </button>
      </div>
    </div>
  );
};

export default App;
