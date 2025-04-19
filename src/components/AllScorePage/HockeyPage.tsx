import { IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonPage } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { fetchData } from "../../apiServices"; // Import your API fetch function
import { now, countries } from "../../utils/const";
import CountryCard from "../CountryCard/index";
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
const HockeyPage: React.FC = () => {

  const [countryArr, setCountyArr] = useState<any | []>([]);

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
        const apiResponse = await fetchData(`ice-hockey/matches/${now.date}/${now.month}/${now.year}`);
        const temp: any[] = [];
        apiResponse.events.forEach((element: any) => {
          if (element.awayTeam.country.name == element.homeTeam.country.name && element.awayTeam.sport.name == "Ice hockey" && element.homeTeam.sport.name == "Ice hockey") {
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
            return <CountryCard key={index + "Ice_hockey_PlayCard"} label={value.countryName} flag={value.countryFlag} count={value.matchCount} competitions_name={value.competitions_name} competitions={value.competitions} />
          })
        }
      </div>
    </div>
  );
};

export default HockeyPage;
