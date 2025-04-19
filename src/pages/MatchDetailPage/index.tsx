import { IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonPage, IonRow, IonText, } from '@ionic/react';
import { useHistory, useLocation } from 'react-router';
import './football-match-detail.css'
import { useState, useEffect } from 'react';
import { fetchData, getImageData } from '../../apiServices';
import Detail from '../../components/MatchDetailPage/Detail';
import LineUps from "../../components/MatchDetailPage/Lineups";
import Stats from '../../components/MatchDetailPage/Stats';
import { chevronBackOutline } from 'ionicons/icons';

interface MatchDetailState {
    match: {
        id: string;
        homeTeam: string;
        homeID: string;
        awayTeam: string;
        awayID: string;
        homeScore: number;
        awayScore: number;
        status: string;
    };
    competitionName: string;
    competitionIcon: string;
}
const MatchDetailPage: React.FC = () => {
    const location = useLocation<MatchDetailState>();
    const { match, competitionName, competitionIcon } = location.state;
    const history = useHistory();
    const [isLiveButtonVisible, setIsLiveButtonVisible] = useState(false);
    const [homeLogo, setHomeLogo] = useState<any | null>(null)
    const [awayLogo, setAwayLogo] = useState<any | null>(null)
    const [injuryTime, setInjuryTime] = useState<string>("");
    const [roundInfo, setRoundInfo] = useState<string>("");
    const [matchSlug, setMatchSlug] = useState<string>("");
    const [topTab, setTopTab] = useState<string>("match");
    const [bottomTab, setBottomTab] = useState<string>("detail");

    const temp = {
        match,
        competitionName,
    }
    const matchString = encodeURIComponent(JSON.stringify(temp));

    useEffect(() => {
        let temp = match;
        const fetchIconData = async (): Promise<void> => {
            const response = await getImageData(`team/${match.homeID}/image`);
            setHomeLogo(response);
            const response1 = await getImageData(`team/${match.awayID}/image`);
            setAwayLogo(response1);
            temp = {
                ...temp,
                homeLogo: response,
                awayLogo: response1
            };

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
            console.log(response);
            if(response.event.status.type == "finished" || response.event.status.type == "notstarted"){
                setIsLiveButtonVisible(false);
            }
            else{
                setIsLiveButtonVisible(true);
            }
        }
        fetchMatchDetail();
    }, [match]);

    return (
        <IonPage>
            <IonHeader className='ion-no-border'>
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
                    <div className="matchDetail-end" onClick={() => history.push(`playdetail/${matchString}`)}>
                        {isLiveButtonVisible ? (
                            "Live"
                        ) : "    "}
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
                <div className="matchDetail-top-tab-container">
                    <button className={"matchDetail-top-tab" + (topTab == "match" ? " matchDetail-top-tab-selected" : "")} onClick={() => setTopTab("match")}>Match</button>
                    <button className={"matchDetail-top-tab" + (topTab == "buzz" ? " matchDetail-top-tab-selected" : "")} onClick={() => setTopTab("buzz")}>BUZZ</button>
                    <button className={"matchDetail-top-tab" + (topTab == "insights" ? " matchDetail-top-tab-selected" : "")} onClick={() => setTopTab("insights")}>INSIGHTS</button>
                </div>
            </IonHeader>

            {topTab == "match" &&
                <div style={{ height: "100%" }}>
                    <div className="matchDetail-bottom-tab-container">
                        <div style={{ width: "33.3%", display: "flex" }}><button className={"matchDetail-bottom-tab" + (bottomTab == "detail" ? " matchDetail-bottom-tab-selected" : "")} onClick={() => setBottomTab("detail")}>Detail</button></div>
                        <div style={{ width: "33.3%", display: "flex" }}><button className={"matchDetail-bottom-tab" + (bottomTab == "lineups" ? " matchDetail-bottom-tab-selected" : "")} onClick={() => setBottomTab("lineups")}>LineUps</button></div>
                        <div style={{ width: "33.3%", display: "flex" }}><button className={"matchDetail-bottom-tab" + (bottomTab == "stats" ? " matchDetail-bottom-tab-selected" : "")} onClick={() => setBottomTab("stats")}>Stats</button></div>
                        {/* <div style={{ width: "25%", display: "flex" }}><button className={"matchDetail-bottom-tab" + (bottomTab == "draw" ? " matchDetail-bottom-tab-selected" : "")} onClick={() => setBottomTab("draw")}>Draw</button></div> */}
                    </div>
                    {bottomTab == "detail" && <Detail data={match} />}
                    {bottomTab == "lineups" && <LineUps data={match} />}
                    {bottomTab == "stats" && <Stats data={match} />}
                    {/* { bottomTab == "draw" && <d />} */}
                </div>
            }
        </IonPage>
    );
};

export default MatchDetailPage; 