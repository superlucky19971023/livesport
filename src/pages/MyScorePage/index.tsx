import { IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonPage } from "@ionic/react";
import React, { useEffect, useState } from "react";
import MatchCard from "../../components/MatchCard";
import useScrollStore from "../../stores/scroll.store";
import { useScrollVisibility } from "../../components/ScrollVisible";
import { fetchData, getImageData } from "../../apiServices"; // Import your API fetch function
import { now } from "../../utils/const";
import "./MyScorePage.css";


interface Match {
  id: number;
  homeTeam: string;
  homeID: any; // Placeholder for team icon
  awayTeam: string;
  awayID: any; // Placeholder for team icon
  homeScore: number;
  awayScore: number;
  status: string;
  startTime: number; // Add this
}

interface Competition {
  name: string;
  icon: string; // Placeholder for competition icon
  matches: Match[];
}

interface Day {
  date: string;
  timestamp: number; // Add this
  competitions: Competition[];
}

const MyScorePage: React.FC = () => {
  const [matches, setMatches] = useState<Day[]>([]); // State to store matches
  const [hasMore, setHasMore] = useState(true); // Tracks if there's more data to load
  const { isVisible, scrollContainerRef, handleScroll } = useScrollVisibility();
  const { scrollIsVisible, setIsVisible } = useScrollStore();

  useEffect(() => {
    if (isVisible) setIsVisible(true);
    else setIsVisible(false);
  }, [isVisible]);

  // Function to transform API data to the required structure
  const transformApiResponse = (data: any): Day[] => {
    const daysMap: { [key: string]: Day } = {};

    // First, create the days map as before
    data.forEach((event: any) => {
      // Store the timestamp for sorting
      const timestamp = event.startTimestamp * 1000;
      const eventDate = new Date(timestamp).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!daysMap[eventDate]) {
        daysMap[eventDate] = {
          date: eventDate,
          timestamp: timestamp, // Add timestamp for sorting
          competitions: [],
        };
      }
      
      const competitionName = event.tournament.uniqueTournament.name;
      let competition = daysMap[eventDate].competitions.find(
        (comp) => comp.name === competitionName
      );

      if (!competition) {
        competition = {
          name: competitionName,
          icon: event.tournament.uniqueTournament.id,
          matches: [],
        };
        console.log(competition.name + ':' + competition.icon)
        daysMap[eventDate].competitions.push(competition);
      }

      competition.matches.push({
        id: event.id,
        homeTeam: event.homeTeam.shortName,
        homeID: event.homeTeam.id,
        awayTeam: event.awayTeam.shortName,
        awayID: event.awayTeam.id,
        homeScore: event.homeScore.current,
        awayScore: event.awayScore.current,
        status: event.status.description,
        startTime: timestamp, // Add startTime for sorting matches
      });
    });

    // Convert to array and sort by timestamp
    const sortedDays = Object.values(daysMap)
      .sort((a, b) => a.timestamp - b.timestamp);

    // Sort matches within each competition by startTime
    sortedDays.forEach(day => {
      day.competitions.forEach(competition => {
        competition.matches.sort((a, b) => a.startTime - b.startTime);
      });
      
      // Also sort competitions by their first match time
      day.competitions.sort((a, b) => {
        const aTime = a.matches[0]?.startTime || 0;
        const bTime = b.matches[0]?.startTime || 0;
        return aTime - bTime;
      });
    });

    return sortedDays;
  };

  // Initial fetch
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const apiResponse = await fetchData(`matches/${now.date}/${now.month}/${now.year}`);
        // const apiResponse = await fetchData(`matches/2/3/2023`);
        const temp: any[] = [];
        apiResponse?.events?.forEach((element: any) => {
          if (element.awayTeam.gender == "M" && element.homeTeam.gender == "M" && element.awayTeam.sport.name == "Football" && element.homeTeam.sport.name == "Football") {
            // console.log(element);
            temp.push(element);
          }
        });
        if (temp.length != 0) {
          const transformedData = transformApiResponse(temp.slice(0, 50));
          setMatches(transformedData.slice(0, 3)); // Load the first 3 days initially
          if (transformedData.length <= 3) {
            setHasMore(false);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadInitialData();
  }, []);

  // Load more matches
  const loadMoreMatches = async (event: CustomEvent<void>) => {
    setTimeout(async () => {
      try {
        // const apiResponse = await fetchData("group/tournament/1469/season/41897/matches"); // Replace with your API URL
        // const transformedData = transformApiResponse(apiResponse);
        // const currentLength = matches.length;
        // const nextMatches = transformedData.slice(currentLength, currentLength + 3); // Load 3 more days at a time

        // setMatches((prevMatches) => [...prevMatches, ...nextMatches]);

        // // Check if we've loaded all data
        // if (matches.length + nextMatches.length >= transformedData.length) {
        //   setHasMore(false); // No more data to load
        // }

        // // Complete the infinite scroll event
        // (event.target as HTMLIonInfiniteScrollElement).complete();
      } catch (error) {
        console.error("Error fetching more data:", error);
        (event.target as HTMLIonInfiniteScrollElement).complete();
      }
    }, 1000); // Simulate API delay
  };

  return (
    <IonPage>
      <IonContent fullscreen scrollEvents={true} ref={scrollContainerRef} onIonScroll={handleScroll}>
        {/* <div className="w-full h-screen"> */}
          {matches.map((day, index) => (
            <div key={index} className="day-section">
              <div className="date-header">
                <div className="date-info">
                  <div className="date-title">{day.date}</div>
                  <div className="match-count">({day.competitions.length + "Competitions"})</div>
                </div>
              </div>

              {day.competitions.map((competition, compIndex) => (
                <div key={compIndex} className="competition-section">
                  <div className="my-competition"> My Competitions</div>
                  {competition.matches.length === 0 ? (
                    <div className="no-matches">No matches available</div>
                  ) : (
                    <MatchCard
                      key={compIndex + "MatchCard1"}
                      kind="football"
                      name={competition.name}
                      icon={competition.icon}
                      matches={competition.matches}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* Infinite Scroll */}
          <IonInfiniteScroll
            onIonInfinite={loadMoreMatches}
            threshold="100px"
            disabled={!hasMore}
          >
            <IonInfiniteScrollContent
              loadingSpinner="bubbles"
              loadingText="Loading more matches..."
            />
          </IonInfiniteScroll>
        {/* </div> */}
      </IonContent>
    </IonPage>
  );
};

export default MyScorePage;
