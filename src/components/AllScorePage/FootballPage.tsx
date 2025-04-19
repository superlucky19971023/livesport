import { IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonPage } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { fetchData } from "../../apiServices"; // Import your API fetch function
import { now, countries } from "../../utils/const";
import CountryCard from "../CountryCard/index";
import MatchCard from "../MatchCard";
import "./FootballPage.css";
interface Match {
  id: number;
  homeTeam: string;
  homeID: any; // Placeholder for team icon
  awayTeam: string;
  awayID: any; // Placeholder for team icon
  homeScore: number;
  awayScore: number;
  status: string;
  startTime: number;
  kind: string;
  name: string;
  flag: string;
}

interface CompetitionPopular {
  name: string;
  icon: number;  // Changed to number
  matches: Match[];
  kind: string;
}

const FootballPage: React.FC = () => {
  const [countryArr, setCountyArr] = useState<any[]>([]);
  const [uefaCompetitions, setUefaCompetitions] = useState<Competition[]>([]);

  const filterUEFACompetitions = (data: any[]): CompetitionPopular[] => {
    const uefaCompetitionsMap: { [key: string]: CompetitionPopular } = {
      "UEFA Champions League": {
        name: "UEFA Champions League",
        icon: 1465,  // UEFA Champions League ID
        matches: [],
        kind: "Football"
      },
      "UEFA Europa League": {
        name: "UEFA Europa League",
        icon: 679,  // UEFA Europa League ID
        matches: [],
        kind: "Football"
      },
      "UEFA Europa Conference League": {
        name: "UEFA Europa Conference League",
        icon: 17015,  // UEFA Conference League ID
        matches: [],
        kind: "Football"
      },
      "Championship": {
        name: "Championship",
        icon: 18,
        matches: [],
        kind: "Football"
      }
    };

    data.forEach((element: any) => {
      if (uefaCompetitionsMap[element.tournament.name]) {
        const match = {
          id: element.id,
          homeID: element.homeTeam.id,
          awayID: element.awayTeam.id,
          homeTeam: element.homeTeam.shortName,
          awayTeam: element.awayTeam.shortName,
          homeScore: element.homeScore.current,
          awayScore: element.awayScore.current,
          status: element.status.description,
          startTime: element.startTimestamp,
          kind: "Football",
          name: element.tournament.name,
          flag: element.tournament.uniqueTournament.id
        };
        
        uefaCompetitionsMap[element.tournament.name].matches.push(match);
      }
    });

    return Object.values(uefaCompetitionsMap).filter(comp => comp.matches.length > 0);
  };

  const transformApiResponse = (data: any[]): any[] => {

    const arrTemp: any[] = [];

    countries.forEach((country, index) => {
      const matchTemp: Match[] = [];

      if (data.length != 0) {
        data && data.forEach((element: any) => {
          if (element.homeTeam.country.name == country) {
            matchTemp.push({
              id: element.id,
              homeID: element.homeTeam.id,
              awayID: element.awayTeam.id,
              homeTeam: element.homeTeam.shortName,
              awayTeam: element.awayTeam.shortName,
              homeScore: element.homeScore.current,
              awayScore: element.awayScore.current,
              status: element.status.description,
              startTime: element.startTimestamp,
              kind: element.awayTeam.sport.name,
              name: element.tournament.name,
              flag: element.homeTeam.country.alpha2
            })
          }
        })
      }

      if (matchTemp.length != 0) {
        arrTemp.push(
          {
            countryName: country,
            countryFlag: matchTemp[0] ? matchTemp[0].flag : "",
            matchCount: matchTemp.length,
            competitions: matchTemp,
            competitions_name: matchTemp[0] ? matchTemp[0].name : ""
          }
        )
      }
    })

    return arrTemp;
  }

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const apiResponse = await fetchData(`matches/${now.date}/${now.month}/${now.year}`);
        const temp: any[] = [];
        
        apiResponse.events.forEach((element: any) => {
          if (element.awayTeam.country.name === element.homeTeam.country.name && 
              element.awayTeam.sport.name === "Football" && 
              element.homeTeam.sport.name === "Football") {
            temp.push(element);
          }
        });
        
        if (temp.length !== 0) {
          const transformedData = transformApiResponse(temp);
          setCountyArr(transformedData);
          
          // Filter UEFA competitions
          const uefaData = filterUEFACompetitions(apiResponse.events);
          setUefaCompetitions(uefaData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadInitialData();
  }, []);

  return (
    <div className="football-container">
      <div className="football-container-title">
        Popular Competitions
      </div>
      <div>
        {uefaCompetitions.map((competition, index) => (
          <MatchCard
            key={`UEFA_${index}`}
            kind={competition.kind}
            name={competition.name}
            icon={competition.icon}
            matches={competition.matches}
          />
        ))}
      </div>
      <div className="football-container-title">
        Competitions By Country
      </div>
      <div>
        {countryArr.map((value: any, index: number) => (
          <CountryCard
            key={index + "Football_PlayCard"}
            label={value.countryName}
            flag={value.countryFlag}
            count={value.matchCount}
            competitions_name={value.competitions_name}
            competitions={value.competitions}
          />
        ))}
      </div>
    </div>
  );
};

export default FootballPage;
