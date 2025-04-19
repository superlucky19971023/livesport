import { IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonPage } from "@ionic/react";
import React, { useEffect, useState } from "react";
import MatchCard from "../MatchCard";
import useScrollStore from "../../stores/scroll.store";
import { useScrollVisibility } from "../ScrollVisible";
import { fetchData } from "../../apiServices"; // Import your API fetch function
import { sync } from "ionicons/icons";

interface Match {
  id: number;
  homeTeam: string;
  homeIcon: string; // Placeholder for team icon
  awayTeam: string;
  awayIcon: string; // Placeholder for team icon
  homeScore: number;
  awayScore: number;
  status: string;
}

interface Competition {
  name: string;
  icon: string; // Placeholder for competition icon
  matches: Match[];
}

interface Day {
  date: string;
  matchCount: string;
  competitions: Competition[];
}

const VolleyballPage: React.FC = () => {
  const [matches, setMatches] = useState<Day[]>([]); // State to store matches
  const [hasMore, setHasMore] = useState(true); // Tracks if there's more data to load
  const { isVisible, scrollContainerRef, handleScroll } = useScrollVisibility();
  const { scrollIsVisible, setIsVisible } = useScrollStore();
  const [logo, SetLogo] = useState(null);

  useEffect(() => {
    if (isVisible) setIsVisible(true);
    else setIsVisible(false);
  }, [isVisible]);

  // Function to transform API data to the required structure
  const transformApiResponse = (data: any): Day[] => {
    const daysMap: { [key: string]: Day } = {};

    data.events.forEach((event: any) => {
      const eventDate = new Date(event.startTimestamp * 1000).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!daysMap[eventDate]) {
        daysMap[eventDate] = {
          date: eventDate,
          matchCount: "0 Matches",
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
          icon: "img/UEFA.png", // Placeholder for competition icon
          matches: [],
        };
        daysMap[eventDate].competitions.push(competition);
      }

      
      competition.matches.push({
        id: event.id,
        homeTeam: event.homeTeam.name,
        homeIcon: `/img/${event.homeTeam.slug}.png`, // Placeholder for team icon
        awayTeam: event.awayTeam.name,
        awayIcon: `/img/${event.awayTeam.slug}.png`, // Placeholder for team icon
        homeScore: event.homeScore.current,
        awayScore: event.awayScore.current,
        status: event.status.description,
      });

      // Update match count
      daysMap[eventDate].matchCount = `${competition.matches.length} Matches`;
    });

    return Object.values(daysMap);
  };
  // Initial fetch
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const apiResponse = await fetchData("group/tournament/1469/season/41897/matches"); // Replace with your API URL
        const transformedData = transformApiResponse(apiResponse);
        setMatches(transformedData.slice(0, 3)); // Load the first 3 days initially
        if (transformedData.length <= 3) {
          setHasMore(false);
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
        const apiResponse = await fetchData("group/tournament/1469/season/41897/matches"); // Replace with your API URL
        const transformedData = transformApiResponse(apiResponse);
        const currentLength = matches.length;
        const nextMatches = transformedData.slice(currentLength, currentLength + 3); // Load 3 more days at a time

        setMatches((prevMatches) => [...prevMatches, ...nextMatches]);

        // Check if we've loaded all data
        if (matches.length + nextMatches.length >= transformedData.length) {
          setHasMore(false); // No more data to load
        }

        // Complete the infinite scroll event
        (event.target as HTMLIonInfiniteScrollElement).complete();
      } catch (error) {
        console.error("Error fetching more data:", error);
        (event.target as HTMLIonInfiniteScrollElement).complete();
      }
    }, 1000); // Simulate API delay
  };

  return (
    <IonPage>
      
    </IonPage>
  );
};

export default VolleyballPage;
