import type React from "react"
import {
    IonContent,
    IonHeader,
    IonPage,
    IonIcon,
    IonImg,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
} from "@ionic/react"
import "./PlayDetailView.css"
import { useState, useEffect } from 'react';
import { fetchData, fetchVideoStreamUrl, getImageData } from '../../apiServices';
import { chevronBackOutline } from "ionicons/icons"
import { useHistory, useParams } from 'react-router-dom';
import JWPlayerComponent from "../../components/JWPlayerComponent";

const PlayDetailView: React.FC = () => {
    const { detail } = useParams<{ detail?: string }>()
    const { match, competitionName } = JSON.parse(decodeURIComponent(detail || ""));

    const history = useHistory();
    const [homeLogo, setHomeLogo] = useState<any | null>(null)
    const [awayLogo, setAwayLogo] = useState<any | null>(null)
    const [injuryTime, setInjuryTime] = useState<string>("");
    const [roundInfo, setRoundInfo] = useState<string>("");
    const [matchSlug, setMatchSlug] = useState<string>("");
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log(match.id);

        const fetchIconData = async (): Promise<void> => {
            const response = await getImageData(`team/${match.homeID}/image`);
            setHomeLogo(response);

            const response1 = await getImageData(`team/${match.awayID}/image`);
            setAwayLogo(response1);
        }
        fetchIconData();

        const fetchMatchDetail = async (): Promise<void> => {
            const response = await fetchData(`match/${match.id}`);
            if (match.status.toLocaleLowerCase() == "ended") {
                setInjuryTime(response.event.time.injuryTime1 + "/" + response.event.time.injuryTime2);

            }
            setRoundInfo("Round of " + response.event.roundInfo.round);
            let temp = response.event.slug.charAt(0).toUpperCase() + response.event.slug.slice(1).replace(/-/g, ' ');
            setMatchSlug(temp);
        }
        fetchMatchDetail();
    }, [match]);

    useEffect(() => {
        const getVideoUrl = async () => {
            try {
                setIsLoading(true);
                // Make sure match.id contains the full slug
                console.log({match})
                const streamUrl = await fetchVideoStreamUrl(match);
                console.log(streamUrl);
                setVideoUrl(streamUrl);
            } catch (error) {
                console.error("Failed to fetch video URL:", error);
                // Handle error appropriately in the UI
                setVideoUrl("");
            } finally {
                setIsLoading(false);
            }
        };

        if (match.id) {
            getVideoUrl();
        }
    }, [match.id]);

    if (isLoading) {
        return <IonSpinner />;
    }

    return (
        <IonPage>
            <IonHeader className="ion-no-border match-header-football">
                <div color="transparent" className="detail-image">
                    <div className="matchDetail-start">
                        <div onClick={() => { history.goBack() }} className='start'>
                            <IonIcon icon={chevronBackOutline} size='default'></IonIcon>
                        </div>
                    </div>
                    <div className="matchDetail-title-football">
                        <IonText className="match-competition-name">{competitionName}</IonText>
                        <IonText className="match-roundInfo-text">{roundInfo}</IonText>
                    </div>
                    <div className="matchDetail-end">
                        {"    "}
                    </div>
                </div>
                <div className="matchDetail-score-container-football">
                    <IonGrid>
                        <IonRow>
                            <IonCol size="4" className="ion-text-center-football">
                                <div className="team-container-football">
                                    <IonImg src={`data:image/png;base64,${homeLogo}`} className="team-logo-football" />
                                    <IonText className="match-competition-name">{match.homeTeam}</IonText>
                                </div>
                            </IonCol>

                            <IonCol size="4" className="ion-text-center-football">
                                <div className="score-container-football">
                                    <IonText color="medium" className="match-competition-name">
                                        {injuryTime}
                                    </IonText>
                                    <div className="score-football">{match.homeScore} - {match.awayScore}</div>
                                    <IonText color="medium" className="match-status-football">
                                        {match.status}
                                    </IonText>

                                </div>
                            </IonCol>

                            <IonCol size="4" className="ion-text-center-football">
                                <div className="team-container-football">
                                    <IonImg src={`data:image/png;base64,${awayLogo}`} className="team-logo-football" />
                                    <IonText className="match-competition-name">{match.awayTeam}</IonText>
                                </div>
                            </IonCol>
                        </IonRow>

                        <IonRow style={{ display: "flex", alignItem: "center", justifyContent: "center", fontSize: "12px" }}>
                            {matchSlug}
                        </IonRow>
                    </IonGrid>
                </div>
            </IonHeader>
            <IonContent>
                {videoUrl && <div style={{
                    width: '100%',
                    height: '0px',
                    position: 'relative',
                    paddingBottom: '56.25%',
                    background: '#000'
                }}>
                    <iframe 
                        src={videoUrl} 
                        width='100%' 
                        height='100%' 
                        allowFullScreen
                        allow='autoplay' 
                        style={{ width: '100%', height: '100%', position: 'absolute', left: '0px', top: '0px', overflow: 'hidden' }}>
                    </iframe>
                </div>}
            </IonContent>
        </IonPage>
    )
}

export default PlayDetailView

