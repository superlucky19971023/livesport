import type React from "react"
import {
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonItem,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonText,
    IonPage,
} from "@ionic/react"
import "./EachCountryCard.css"
// import FootBallMatchDetail from "./FootBallMatchDetail";
import { Redirect, useHistory } from "react-router";

import { useEffect, useState } from "react";

import { fetchData, getImageData } from "../../apiServices";
import axios, { ResponseType } from "axios";
// import { useNavigate } from "react-router-dom";

interface propsType {
    data: any
}

const EachCountryCard: React.FC<propsType> = ({ data }) => {

    const history = useHistory();

    const [homeLogo, setHomeLogo] = useState<any | null>(null);
    const [awayLogo, setAwayLogo] = useState<any | null>(null);
    const date = new Date(data.startTime * 1000);
    const timeString = `${date.getHours()} : ${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
    const getLogoData = async (match: any) => {
        try {
            let url = match.kind.toLowerCase() + "/";
            if (match.kind == "football" || match.kind == undefined || match.kind == "Football") {
                url = ""
            }
            const response = await getImageData(`${url}team/${match.homeID}/image`);
            setHomeLogo(response);

            const response1 = await getImageData(`${url}team/${match.awayID}/image`);
            setAwayLogo(response1);


        } catch (error) {
            console.error('Error fetching image:', error);
        }

    }

    const handleMatchClick = (match: Match) => {
        history.push('/match-detail', {
            match,
            competitionName: name,
            competitionIcon: "icon"
        });
    };

    useEffect(() => {
        getLogoData(data)
    }, []);

    return (
        // <IonPage>
        <IonItem
            key={data.index}
            lines={data.index === length - 1 ? "none" : "full"}
            className="match-item"
            onClick={() => handleMatchClick(data)}
        >
            <IonGrid className="match-grid">
                <IonRow className="match-row">
                    <IonCol size="4.5" className="team-col home-team">
                        <div className="team-container">
                            <IonLabel className="team-name">{data.homeTeam}</IonLabel>
                            <img src={`data:image/png;base64,${homeLogo}`} className="team-logo" />
                        </div>
                    </IonCol>

                    <IonCol size="3" className="score-col">
                        {data.status != "Not started" ?
                            <div className="score-container">
                                <IonText color="medium" className="status-text">
                                    {data.status}
                                </IonText>
                                <IonLabel className="score-text">
                                    {data.homeScore} - {data.awayScore}
                                </IonLabel>
                            </div> : <div className="score-container" style={{ fontSize: "12px" }}>
                                {timeString }
                            </div>
                        }
                    </IonCol>

                    <IonCol size="4.5" className="team-col away-team">
                        <div className="team-container">
                            <IonImg src={`data:image/png;base64,${awayLogo}`} className="team-logo" />
                            <IonLabel className="team-name">{data.awayTeam}</IonLabel>
                        </div>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonItem>
        // </IonPage>
    )
}

export default EachCountryCard;