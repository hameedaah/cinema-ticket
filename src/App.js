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

  const [movieCounters, setMovieCounters] = useState(() => {
    const initialCounters = [];
    for (let i = 0; i < movies.length; i++) {
      initialCounters.push(10);
    }
    return initialCounters;
  });

  const handleClick = () => {
    const data = movies.map((movie, index) => ({
      movieTitle: "Extraction 2",
      price: 4000,
      requestedSeats: movieCounters[index],
      status: "processing",
    }));

    console.log(data)

    const requests = data.map((dataItem) =>
      axios.post("http://161.35.117.1:3000/cinema/book", dataItem, {
        headers: { "Content-Type": "application/json" },
      })
    );

    const allResponses = [];

    axios
      .all(requests)
      .then((responses) => {
        responses.forEach((response) => {
          allResponses.push(response.data);
        });
        setMovieData(allResponses);
        console.log("Booking successful", allResponses);
      })
      .catch((error) => {
        console.log("Booking failed", error);
      });
  };


  // function makeAPICall() {
  //   return axios
  //     .post("http://161.35.117.1:3000/cinema/book")
  //     .then((response) => response.data)
  //     .catch((error) => {
  //       console.error("Error making API call:", error);
  //       throw error;
  //     });
  // }

  // function makeSimultaneousAPICalls() {
  //   const numberOfCalls = 5; // Define the number of simultaneous calls

  //   const promises = Array.from({ length: numberOfCalls }, () => makeAPICall());

  //   Promise.all(promises)
  //     .then((results) => {
  //       // Handle the results of the simultaneous API calls
  //       console.log(results);
  //     })
  //     .catch((error) => {
  //       // Handle error if any of the API calls fail
  //       console.error("Error in simultaneous API calls:", error);
  //     });
  // }

  // function MyComponent() {
  //   return (
  //     <div>
  //       <button onClick={makeSimultaneousAPICalls}>
  //         Make Simultaneous API Calls
  //       </button>
  //     </div>
  //   );
  // }

  const UserComponent = ({ title, index }) => {
    const counter = movieCounters[index];

    const handleIncrement = () => {
      if (counter < 200) {
        const updatedCounters = [...movieCounters];
        updatedCounters[index] = counter + 10;
        setMovieCounters(updatedCounters);
      }
    };

    const handleDecrement = () => {
      if (counter > 1) {
        const updatedCounters = [...movieCounters];
        updatedCounters[index] = counter - 10;
        setMovieCounters(updatedCounters);
      }
    };

    return (
      <th className="ticket-card">
        <div className="row title">{title}</div>
        <hr></hr>
        <div className="row-btns">
          <button onClick={handleDecrement} disabled={counter <= 10}>
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
        <button
          onClick={handleClick}
          // onClick={makeSimultaneousAPICalls}
          className="tickets-btn"
        >
          Book Tickets
        </button>
      </div>
    </div>
  );
};

export default App;