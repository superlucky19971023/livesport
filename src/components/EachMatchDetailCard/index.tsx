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
import "./EachMatchDetailCard.css"
// import FootBallMatchDetail from "./FootBallMatchDetail";
import { Redirect, useHistory } from "react-router";

import { useEffect, useState } from "react";

import { fetchData, getImageData } from "../../apiServices";
import axios, { ResponseType } from "axios";
// import { useNavigate } from "react-router-dom";

interface propsType {
    match: any,
    index: any,
    length: number,
    icon: any,
    kind: string,
    name: string
}

const EachMatchDetailCard: React.FC<propsType> = ({ match, kind, index, length, icon, name }) => {

    const history = useHistory();
    const [homeLogo, setHomeLogo] = useState<any | null>(null);
    const [awayLogo, setAwayLogo] = useState<any | null>(null);
    const [loading, setLoading] = useState<string | "">("");
    const getLogoData = async (match: any) => {
        try {
            let url = kind + "/";
            if (kind.toLocaleLowerCase() == "football" || kind == undefined) {
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
            competitionIcon: icon
        });
    };

    useEffect(() => {
        getLogoData(match)
    }, []);

    return (
        // <IonPage>
        <IonItem
            key={index + "EachMatchDetailCard"}
            lines={index === length - 1 ? "none" : "full"}
            className="match-item"
            onClick={() => handleMatchClick(match)}
        >
            <IonGrid className="match-grid">
                <IonRow className="match-row">
                    <IonCol size="4.5" className="team-col home-team">
                        <div className="team-container">
                            <IonLabel className="team-name">{match.homeTeam}</IonLabel>
                            <img src={`data:image/png;base64,${homeLogo}`} className="team-logo" />
                        </div>
                    </IonCol>

                    <IonCol size="3" className="score-col">
                        <IonText color="medium" className="status-text">
                            {match.status}
                        </IonText>
                        <IonLabel className="score-text">
                            {match.homeScore} - {match.awayScore}
                        </IonLabel>
                    </IonCol>

                    <IonCol size="4.5" className="team-col away-team">
                        <div className="team-container">
                            <IonImg src={`data:image/png;base64,${awayLogo}`} className="team-logo" />
                            <IonLabel className="team-name">{match.awayTeam}</IonLabel>
                        </div>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonItem>
        // </IonPage>
    )
}

export default EachMatchDetailCard;