import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackendService } from "genezio-sdk";
import { formatDate } from "@fullcalendar/core";
import NavbarComponent from "../components/navbar.component.tsx";
import { useAuthApi, useAuthMutation } from "../hooks/api.ts";

type response = {
  title: string;
  start: string;
  end: string;
};

type request = {
  eventId: string;
};
const MyAppointments: React.FC = () => {
  const [eventsDate, setEventsDate] = useState<{ [key: string]: any }>({});
  const [allUserEvents, loadingEvents, errorLoadinEvents] = useAuthApi<
    response[]
  >({
    method: "GET",
    location: "/getAllEventsByUser",
  });

  const { trigger: deleteEvent } = useAuthMutation<request, any>({
    method: "POST",
    location: "/deleteEvent",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // here este doar un getAuth
    const events = allUserEvents || [];
    events.sort((a: any, b: any) => b.start - a.start);
    setEventsDate(events);
  }, [allUserEvents]);

  const handleDeleteEvent = async (event: any) => {
    try {
      // mutationAuth
      const deleteEvents = await deleteEvent({ eventId: event.id });
      if (deleteEvents.status) {
        window.location.reload();
      } else {
        console.log(deleteEvents.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ position: "absolute", top: 0, width: "100%" }}>
      <NavbarComponent />
      <div className="container pt-5">
        <div className="card shadow">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <h1>Programările mele</h1>
            </div>
            <div className="table-responsive">
              <table className="table mt-3">
                <thead>
                  <tr>
                    <th scope="col">Incepe la</th>
                    <th scope="col">Se termină la</th>
                    <th scope="col">Masina</th>
                    {/* <th scope="col">Delete</th> */}
                  </tr>
                </thead>
                <tbody>
                  {Object.values(eventsDate).map((event: any) => (
                    <tr key={event.id}>
                      <td>
                        {formatDate(event.start, {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: false,
                        })}
                      </td>
                      <td>
                        {formatDate(event.end, {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: false,
                        })}
                      </td>
                      <td>
                        {["first", "second", "third", "four"].includes(
                          event.number,
                        )
                          ? event.number === "first"
                            ? "1"
                            : event.number === "second"
                              ? "2"
                              : event.number === "third"
                                ? "3"
                                : event.number === "four"
                                  ? "4"
                                  : "invalid"
                          : ""}
                      </td>
                      <td>
                        {/* <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteEvent(event)}
                        >
                          Delete
                        </button> */}
                      </td>
                    </tr>
                  ))}
                  {Object.keys(eventsDate).length === 0 && (
                    <tr>
                      <td colSpan={4}>Nu ai programări</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
