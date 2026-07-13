import React, { useCallback, useEffect, useState } from "react";
import { Col, Container, Nav, Row, Tab, Card } from "react-bootstrap";
import CalendarComponent from "../components/calendar.component.tsx";
import CalendarMobileComponent from "../components/calendar.mobile.component.tsx";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import NavbarComponent from "../components/navbar.component.tsx";
import { useAuthMutation } from "../hooks/api.ts";

const dayNames = ["first", "second", "third", "four"];

type reqBody = {
  numberCalendar: string;
};

const Calendars: React.FC = () => {
  const [eventsDate, setEventsDate] = useState<{ [key: string]: any }>({});
  const [activeTab, setActiveTab] = useState(dayNames[0]);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const {
    trigger: getEventsCalendar,
    loading: loadingMutation,
    error: errorMutatuion,
  } = useAuthMutation<reqBody, any>({
    method: "POST",
    location: "/getEventsCalendar",
  });

  const fetchEventsForDay = useCallback(async (day: string) => {
    try {
      return await getEventsCalendar({ numberCalendar: day });
    } catch (error) {
      console.log(error);
      return [];
    }
  }, []);

  const initializeDefaultTab = async () => {
    try {
      const events = await fetchEventsForDay(activeTab);
      console.log("Here");
      console.log(events);
      setEventsDate((prevEvents) => ({
        ...prevEvents,
        [activeTab]: events,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleTabChange: any = async (eventKey: string | null) => {
    if (eventKey) {
      setActiveTab(eventKey);
      try {
        const events = await fetchEventsForDay(eventKey);
        setEventsDate((prevEvents) => ({
          ...prevEvents,
          [eventKey]: events,
        }));
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const isLoggedIn = async () => {
      try {
        await initializeDefaultTab();
      } catch (error) {}
    };
    isLoggedIn();
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <NavbarComponent />
      <section
        className="project calendare"
        id="project"
        style={{ backgroundColor: "#fff3d1" }}
      >
        <Container>
          <Row>
            <Col xs={12}>
              <div className="mt-5">
                <Card className="shadow-sm">
                  <Card.Body>
                    <Tab.Container
                      id="projects-tabs"
                      activeKey={activeTab}
                      onSelect={handleTabChange}
                    >
                      <Nav
                        className="nav-pills mb-4 justify-content-center flex-wrap"
                        id="pills-tab"
                      >
                        <Row className="w-100">
                          {dayNames.map((day) => (
                            <Col
                              xs={6}
                              sm={4}
                              md={3}
                              className="mb-2"
                              key={day}
                            >
                              <Nav.Item>
                                <Nav.Link
                                  eventKey={day}
                                  className={`btn btn-secondary w-100 ${
                                    activeTab === day ? "active" : ""
                                  }`}
                                  style={{ border: "1px solid black" }}
                                >
                                  {`Mașina ${dayNames.indexOf(day) + 1}`}
                                </Nav.Link>
                              </Nav.Item>
                            </Col>
                          ))}
                        </Row>
                      </Nav>
                      <Tab.Content>
                        {dayNames.map((day) => (
                          <Tab.Pane key={day} eventKey={day}>
                            <Row>
                              <Col xs={12}>
                                {isMobile ? (
                                  <CalendarMobileComponent
                                    dayCalendar={day}
                                    key={day}
                                    eventsDate={eventsDate}
                                    updateEventsDate={(newEvents) => {
                                      setEventsDate((prevEvents) => ({
                                        ...prevEvents,
                                        [day]: newEvents,
                                      }));
                                    }}
                                  />
                                ) : (
                                  <CalendarComponent
                                    dayCalendar={day}
                                    key={day}
                                    eventsDate={eventsDate}
                                    updateEventsDate={(newEvents) => {
                                      setEventsDate((prevEvents) => ({
                                        ...prevEvents,
                                        [day]: newEvents,
                                      }));
                                    }}
                                  />
                                )}
                              </Col>
                            </Row>
                          </Tab.Pane>
                        ))}
                      </Tab.Content>
                    </Tab.Container>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Calendars;
