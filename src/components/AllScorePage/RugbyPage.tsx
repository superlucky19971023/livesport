import { IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonPage } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { fetchData } from "../../apiServices"; // Import your API fetch function
import { now } from "../../utils/const";
// import { countries } from "../../utils/const";
import CountryCard from "../CountryCard/index";
import "./FootballPage.css";
import countryData from 'country-flag-emoji-json';
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
}
const RugbyPage: React.FC = () => {

  const [countryArr, setCountyArr] = useState<any | []>([]);

  const transformApiResponse = (data: any[]): any[] => {

    const arrTemp: any[] = [];

    countryData.forEach((country, index) => {
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
            })
          }
        })
      }

      arrTemp.push(
        {
          countryName: country.name,
          countryFlag: country.emoji,
          matchCount: matchTemp.length,
          competitions: matchTemp,
          competitions_name: matchTemp[0] ? matchTemp[0].name : ""
        }
      )
    })

    return arrTemp;
  }

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const apiResponse = await fetchData(`rugby/matches/${now.date}/${now.month}/${now.year}`);
        const temp: any[] = [];
        apiResponse.events.forEach((element: any) => {
          if (element.awayTeam.country.name == element.homeTeam.country.name && element.awayTeam.sport.name == "Rugby" && element.homeTeam.sport.name == "Rugby") {
            temp.push(element);
          }
        });
        if (temp.length != 0) {
          const transformedData = transformApiResponse(temp);
          setCountyArr(transformedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadInitialData();
  }, []);

  return (
    <div className="football-container">
      {/* <div className="football-container-title" >
        Popular Competitions
      </div> */}
      <div className="football-container-title" >
        Competitions By Country
      </div>
      <div>
        {
          countryArr.map((value: any, index: number) => {
            return <CountryCard label={value.countryName} flag={value.countryFlag} count={value.matchCount} competitions_name={value.competitions_name} competitions={value.competitions} key={index + "Rugby_PlayCard"} />
          })
        }
      </div>
    </div>
  );
};

export default RugbyPage;
