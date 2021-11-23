
//----necessary imports
//importing hooks from React
import { useState, useEffect } from "react";
import "../styles/App.css";

//---component function
export default function Registry(props) {
  //uses state to hold the result of the fetch
  const [allEntries, setAllEntries] = useState([]);

  useEffect(() => {
    //fetches information from a local API route set up on the server
    fetch("http://localhost:5000/allentries")
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        setAllEntries(json);
      });
  }, []);

//conditionally renders the component dependant on the boolean of "lookRegistry" state attached to the "control-registry" button
  if (props.lookRegistry === true) {
    return (
      <>
        <div>
          <div id="entries">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Message</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {/* programmatically renders every entry in the table */}
                {allEntries.map((entry) => {
                  return (
                  <tr key={entry._id}>
                    <td>{entry.name}</td>
                    <td>{entry.date}</td>
                    <td>{entry.msg}</td>
                    <td>
                      {" "}
                      {/* programmatically uses the Mongo _id of the entry to access the correct document in the database */}
                      <form action={`/scribble/${entry._id}`} method="POST">
                        <button>Scribble this out?</button>
                      </form>
                      <form action={`/pencil-in/${entry._id}`} method="POST">
                        <button>Pencil something in?</button>
                      </form>
                    </td>
                  </tr>
                )})}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="4">
                    <form action="/write" method="POST">
                      <input
                        type="text"
                        name="name"
                        placeholder="Who are you?"
                      />
                      <input
                        type="text"
                        name="date"
                        placeholder="When were you here?"
                      />
                      <input
                        type="text"
                        name="msg"
                        placeholder="What do you have to say?"
                      />
                      <input type="submit" value="Write in the log" />
                    </form>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          </div>
      </>
    );
  } else {
    return null;
  }
}
