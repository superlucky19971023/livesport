import type React from "react"
import { useEffect, useState, useRef } from "react"
import { IonSegment, IonSegmentButton, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonContent, IonPage, IonImg, IonButton, IonCard, IonCardHeader, IonCardContent } from "@ionic/react"
import { homeOutline, personOutline, notificationsOutline, settingsOutline } from "ionicons/icons"
import { IonReactRouter } from "@ionic/react-router"
import { Route, Redirect } from "react-router-dom"
import StatsCard from "./StatsCard"
import "./Stats.css"
import { fetchData } from "../../../apiServices"

// Tab content components

interface DetailProps {
    data: any; // Replace 'any' with a proper type if possible
    // homeTeam: string,
    // awayTeam: string
}
const Stats: React.FC<DetailProps> = ({ data }) => {

    const [buttonFlag, setButtonFlag] = useState<string>("ALL");
    const [statsPropsData, setStatsPropsData] = useState<any>([]);
    const [bufferData, setBufferData] = useState<any>(null);
    const [shotMapData, setShotMapData] = useState<any>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [points, setPoints] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const fetchStatsData = async (): Promise<void> => {
            const apiStatsData = await fetchData(`match/${data.id}/statistics`);
            setBufferData(apiStatsData.statistics);
        }

        fetchStatsData()

        const apiShotMap = async (): Promise<void> => {
            const apiShotMapData = await fetchData(`match/${data.id}/shotmap`)
            let coordinations: any = [];
            apiShotMapData.shotmap.forEach((item: any) => {
                coordinations.push({
                    isHome: item.isHome,
                    coordinations: item.playerCoordinates
                });
            })
            setShotMapData(coordinations);
        }

        apiShotMap();
    }, [data])

    useEffect(() => {
        console.log(buttonFlag)
        bufferData != null && bufferData.forEach((element: any) => {
            if (element.period == buttonFlag) {
                let temp: any = [];
                element.groups.map((item: any) => {
                    if (item.groupName == "Match overview" || item.groupName == "Shots" || item.groupName == "Passes" || item.groupName == "Defending" || item.groupName == "Duels") {
                        temp.push(item.statisticsItems);
                    }
                })
                setStatsPropsData(temp);
            }
        })
    }, [buttonFlag])

    useEffect(() => {
        if (imageRef.current && shotMapData) {
          const newPoints = shotMapData.map((element: any) => {
            let topValue = imageRef.current!.clientWidth * element.coordinations.x / 100;
            let leftValue = imageRef.current!.clientHeight * element.coordinations.y / 100;
            
            return (
              <div 
                key={element.id}
                className={element.isHome ? "homeplayer" : "awayplayer"} 
                style={{ top: `${leftValue}px`, left: `${topValue}px` }}
              />
            );
          });
          
          setPoints(newPoints);
        }
      }, [shotMapData]);

    return (
        <IonContent className="main-content-container">
            <div className="categories">
                <div className={buttonFlag == "ALL" ? "button_clicked" : "button"} onClick={() => setButtonFlag("ALL")}>Match</div>
                <div className={buttonFlag == "1ST" ? "button_clicked" : "button"} onClick={() => setButtonFlag("1ST")}>1st Half</div>
                <div className={buttonFlag == "2ND" ? "button_clicked" : "button"} onClick={() => setButtonFlag("2ND")}>2nd Half</div>
            </div>
            <IonCard>
                <IonCardHeader className="shotmap_header">ShotMap</IonCardHeader>
                <IonCardContent className="shotmap_content">
                    <img src="img/shotmap.png" ref={imageRef} id="shotmap"/>
                    {points}
                </IonCardContent>
                <div className="shotmap_footer"></div>
            </IonCard>
            <div>
                <StatsCard key={"StatsCard1"} header="Top Stats" transform={statsPropsData[0] ? statsPropsData[0] : []} />
                <StatsCard key={"StatsCard2"} header="Shots" transform={statsPropsData[1] ? statsPropsData[1] : []} />
                <StatsCard key={"StatsCard3"} header="Passes" transform={statsPropsData[2] ? statsPropsData[2] : []} />
                <StatsCard key={"StatsCard4"} header="Defence" transform={statsPropsData[3] ? statsPropsData[3] : []} />
                <StatsCard key={"StatsCard5"} header="Discilpine" transform={statsPropsData[4] ? statsPropsData[4] : []} />
            </div>
        </IonContent>
    )
}

export default Stats;