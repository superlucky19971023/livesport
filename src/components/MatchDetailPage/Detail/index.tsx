import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonBackButton, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonPage, IonProgressBar, IonRow, IonSegment, IonSegmentButton, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { useHistory, useLocation } from 'react-router';
import './football-match-detail.css'
import { useState, useEffect } from 'react';
import { arrowForward, calendarOutline, footballOutline, home, locationOutline, personOutline, share } from 'ionicons/icons';
import { fetchData, getImageData } from "../../../apiServices"

interface DetailProps {
    data: any; // Replace 'any' with a proper type if possible
}
const Detail: React.FC<DetailProps> = ({ data }) => {
    const match = data;
    const history = useHistory();
    const [isLiveButtonVisible, setIsLiveButtonVisible] = useState(false);
    const [selectedTab, setSelectedTab] = useState<string>("attacker")
    const [activeTab, setActiveTab] = useState<string>("match")
    const [activeSubTab, setActiveSubTab] = useState<string>("details")
    const [activeFilter, setActiveFilter] = useState<string>("top")
    const [homeLogo, setHomeLogo] = useState<any | null>(null)
    const [awayLogo, setAwayLogo] = useState<any | null>(null)
    const [homeAttacker, setHomeAttacker] = useState<any | null>(null);
    const [awayAttacker, setAwayAttacker] = useState<any | null>(null);
    const [homeMidfielder, setHomeMidfielder] = useState<any | null>(null);
    const [awayMidfielder, setAwayMidfielder] = useState<any | null>(null);
    const [homeDefender, setHomeDefender] = useState<any | null>(null);
    const [awayDefender, setAwayDefender] = useState<any | null>(null);
    const [stats, setStats] = useState<any | null>({
        Possession: {
            home: "",
            away: "",
        },
        Expected_Goals: {
            home: "",
            away: "",
        },
        Total_shots: {
            home: "",
            away: "",
        },
        Shots: {
            home: "",
            away: "",
        }
    });
    const [matchDetail, setMatchDetail] = useState<any | null>({
        startDate: new Date(),
        season: {
            titile: "",
            roundinfo: ""
        },
        referee: "",
        matchCounrt: "",
        venue: {
            title: "",
            capacity: ""
        }
    });

    console.log(match.id);
    useEffect(() => {
        // Show Live button only if status is not 'Ended'
        setIsLiveButtonVisible(match.status !== 'Ended');
    }, [match.status]);

    const handleMatchClick = (match: Match) => {
        history.push('/playdetail', {
            match,
            competitionName: name,
        });
    };

    const getTopPlayer = (data: any, kind: string) => {
        const playersWithExpectedGoals = data.filter(
            (player: any) => player.statistics?.expectedGoals !== undefined && player.position == kind
        );

        const playerWithMaxExpectedGoals = playersWithExpectedGoals.reduce((max: any, current: any) => (
            current.statistics.expectedGoals > max.statistics.expectedGoals ? current : max
        ), playersWithExpectedGoals[0]);

        return playerWithMaxExpectedGoals;
    }

    const transformPlayerData = async (data: any) => {
        const homePlayers = data.home.players;
        const awayPlayers = data.away.players;
        let attacker1, midfielder1, defender1, attacker2, midfielder2, defender2;
        attacker1 = getTopPlayer(homePlayers, "F");
        midfielder1 = getTopPlayer(homePlayers, "M");
        defender1 = getTopPlayer(homePlayers, "D");

        attacker2 = getTopPlayer(awayPlayers, "F");
        midfielder2 = getTopPlayer(awayPlayers, "M");
        defender2 = getTopPlayer(awayPlayers, "D");

        let temphome = {
            id: attacker1.player.id,
            name: attacker1.player.name,
            rating: attacker1.statistics?.rating,
            expectedGoals: attacker1.statistics?.expectedGoals,
            min: attacker1.statistics?.minutesPlayed,
            shot: attacker1.statistics?.onTargetScoringAttempt,
            avatar: ""
        }

        let temphome1 = {
            id: midfielder1.player.id,
            name: midfielder1.player.name,
            rating: midfielder1.statistics?.rating,
            expectedGoals: midfielder1.statistics?.expectedGoals,
            min: midfielder1.statistics?.minutesPlayed,
            shot: midfielder1.statistics?.onTargetScoringAttempt,
            avatar: ""
        }

        let temphome2 = {
            id: defender1.player.id,
            name: defender1.player.name,
            rating: defender1.statistics?.rating,
            expectedGoals: defender1.statistics?.expectedGoals,
            min: defender1.statistics?.minutesPlayed,
            shot: defender1.statistics?.onTargetScoringAttempt,
            avatar: ""
        }

        let tempaway = {
            id: attacker2.player.id,
            name: attacker2.player.name,
            rating: attacker2.statistics?.rating,
            expectedGoals: attacker2.statistics?.expectedGoals,
            min: attacker2.statistics?.minutesPlayed,
            shot: attacker2.statistics?.onTargetScoringAttempt,
            avatar: ""
        }

        let tempaway1 = {
            id: midfielder2.player.id,
            name: midfielder2.player.name,
            rating: midfielder2.statistics?.rating,
            expectedGoals: midfielder2.statistics?.expectedGoals,
            min: midfielder2.statistics?.minutesPlayed,
            shot: midfielder2.statistics?.onTargetScoringAttempt,
            avatar: ""
        }

        let tempaway2 = {
            id: defender2.player.id,
            name: defender2.player.name,
            rating: defender2.statistics?.rating,
            expectedGoals: defender2.statistics?.expectedGoals,
            min: defender2.statistics?.minutesPlayed,
            shot: defender2.statistics?.onTargetScoringAttempt,
            avatar: ""
        }

        const response = await getImageData(`player/${temphome.id}/image`);
        temphome.avatar = response;
        const response1 = await getImageData(`player/${tempaway.id}/image`);
        tempaway.avatar = response1;

        const response2 = await getImageData(`player/${temphome1.id}/image`);
        temphome1.avatar = response2;
        const response3 = await getImageData(`player/${tempaway1.id}/image`);
        tempaway1.avatar = response3;

        const response4 = await getImageData(`player/${temphome2.id}/image`);
        temphome2.avatar = response4;
        const response5 = await getImageData(`player/${tempaway2.id}/image`);
        tempaway2.avatar = response5;


        setHomeAttacker(temphome);
        setAwayAttacker(tempaway);
        setHomeMidfielder(temphome1);
        setAwayMidfielder(tempaway1);
        setHomeDefender(temphome2);
        setAwayDefender(tempaway2);
    }
    useEffect(() => {
        const fetchMatchData = async (): Promise<void> => {
            try {
                const apiPlayerDataResponse = await fetchData(`match/${match.id}/lineups`);
                const data = transformPlayerData(apiPlayerDataResponse);
            } catch (error) {
            }
        };

        fetchMatchData();

        const fetchIconData = async (): Promise<void> => {

            // let url = match.kind.toLowerCase() + "/";
            // if (match.kind == "football" || match.kind == undefined || match.kind == "Football") {
            //     url = ""
            // }
            const response = await getImageData(`team/${match.homeID}/image`);
            setHomeLogo(response);

            const response1 = await getImageData(`team/${match.awayID}/image`);
            setAwayLogo(response1);
        }

        fetchIconData();

        const fetchStats = async (): Promise<void> => {
            const response = await fetchData(`match/${match.id}/statistics`)
            let tempStats = {
                Possession: {},
                Expected_Goals: {},
                Total_shots: {},
                Shots: {}
            };
            let allStats: any = [];
            console.log(response.statistics)
            response.statistics.map((element: any) => { if (element.period == "ALL") allStats = element.groups })
            allStats.length != 0 && allStats.map((element: any) => {
                if (element.groupName.toLocaleLowerCase() == "match overview") {
                    element.statisticsItems.forEach((stats: any) => {
                        if (stats.name.toLocaleLowerCase() == "ball possession") {
                            tempStats.Possession = {
                                home: stats.home,
                                away: stats.away
                            }
                        }
                        if (stats.name.toLocaleLowerCase() == "expectedGoals") {
                            tempStats.Expected_Goals = {
                                home: stats.home,
                                away: stats.away
                            }
                        }
                        if (stats.name.toLocaleLowerCase() == "total shots") {
                            tempStats.Total_shots = {
                                home: stats.home,
                                away: stats.away
                            }
                        }

                    })
                }
                if (element.groupName.toLocaleLowerCase() == "shots") {
                    element.statisticsItems.forEach((stats: any) => {
                        if (stats.name.toLocaleLowerCase() == "shots on target") {
                            tempStats.Shots = {
                                home: stats.home,
                                away: stats.away
                            }
                        }
                    })
                }
            })
            setStats(tempStats);
        }

        fetchStats();
        const fetchMatchDetail = async (): Promise<void> => {
            try {
                const apiMatchDetail = await fetchData(`match/${match.id}`);
                let tmp = "";
                let temp = {
                    startDate: new Date(),
                    season: {
                        title: "",
                        roundinfo: ""
                    },
                    referee: "",
                    matchCount: "",
                    venue: {
                        title: "",
                        capacity: ""
                    }
                }
                if (apiMatchDetail.event.defaultPeriodCount == 1) {
                    tmp = apiMatchDetail.event.defaultPeriodCount + "st";
                } else if (apiMatchDetail.event.defaultPeriodCount == 2) {
                    tmp = apiMatchDetail.event.defaultPeriodCount + "nd";
                } else if (apiMatchDetail.event.defaultPeriodCount == 3) {
                    tmp = apiMatchDetail.event.defaultPeriodCount + "rd";
                } else {
                    tmp = tmp + "th";
                }
                temp = {
                    startDate: new Date(apiMatchDetail.event.startTimestamp * 1000),
                    season: {
                        title: apiMatchDetail.event.season.name,
                        roundinfo: 'Round of ' + apiMatchDetail.event.roundInfo.round
                    },
                    referee: apiMatchDetail.event.referee.name,
                    matchCount: tmp,
                    venue: {
                        title: apiMatchDetail.event.venue.name,
                        capacity: apiMatchDetail.event.venue.capacity
                    }
                }
                
                setMatchDetail(temp);
                
                let time = apiMatchDetail.event.time.currentPeriodStartTimestamp;
                console.log(time);

            } catch (error) {
            }
        };

        fetchMatchDetail();
    }, [match])

    return (
        <IonContent className="main-detail-content-container" >
            {/* Match Events */}
            <IonCard className="match-events-container-football">
                <h3 className="section-title">Match Events</h3>

                {/* Filter */}
                <div className="filter-container-football">
                    <div className="matchDetail-top-tab-container">
                        <button
                            className={"matchDetailEvents-top-tab" + (activeFilter === "top" ? " matchDetailEvents-top-tab-selected" : "")}
                            onClick={() => setActiveFilter("top")}
                        >
                            Top
                        </button>
                        <button
                            className={"matchDetailEvents-top-tab" + (activeFilter === "all" ? " matchDetailEvents-top-tab-selected" : "")}
                            onClick={() => setActiveFilter("all")}
                        >
                            All
                        </button>
                    </div>
                </div>

                {/* Timeline */}
                <div className="timeline-container-football">
                    {/* Center line */}
                    <div className="timeline-line-football"></div>

                    {/* End of 90 Minutes */}
                    <div className="timeline-event timeline-milestone-football">
                        <IonChip className="milestone-chip-football">End of 90 Minutes 2-1</IonChip>
                    </div>

                    {/* Brahim Diaz */}
                    <div className="timeline-event-football">
                        <div className="event-left-football">
                            <div className="player-name-football">Brahim Diaz</div>
                            <div className="player-assist-football">Ferland Mendy</div>
                        </div>
                        <div className="event-time-football">
                            <div className="time-label-football">55'</div>
                            <div className="time-dot-football"></div>
                        </div>
                        <div className="event-right-football"></div>
                    </div>

                    {/* Halftime */}
                    <div className="timeline-event timeline-milestone-football">
                        <IonChip className="milestone-chip-football">Halftime 1-1</IonChip>
                    </div>

                    {/* Julian Alvarez */}
                    <div className="timeline-event-football">
                        <div className="event-left-football"></div>
                        <div className="event-time-football">
                            <div className="time-label-football">32'</div>
                            <div className="time-dot-football"></div>
                        </div>
                        <div className="event-right-football">
                            <div className="player-name-football">Oyarsaval</div>
                            <div className="player-assist-football">Javier Galán</div>
                        </div>
                    </div>

                    {/* Rodrygo */}
                    <div className="timeline-event-football">
                        <div className="event-left-football">
                            <div className="player-name-football">Rodrygo</div>
                            <div className="player-assist-football">Federico Valverde</div>
                        </div>
                        <div className="event-time-football">
                            <div className="time-label-football">4'</div>
                            <div className="time-dot-football"></div>
                        </div>
                        <div className="event-right-football"></div>
                    </div>

                    {/* Ball icon */}
                    <div className="timeline-event timeline-end-football">
                        <div className="ball-icon-football"></div>
                    </div>
                </div>
            </IonCard>

            {/* Actual Play Time */}
            <IonCard className="play-time-card-football">
                <IonCardHeader className='play-time-header'>
                    <div className="play-time-header-football">
                        <h3 className="section-title">Actual Play Time</h3>
                        <IonIcon icon={share} slot="icon-only" />
                    </div>
                </IonCardHeader>
                <IonCardContent className='play-time-content-football'>
                    <div className="actual-time-football">Actual 66:58</div>

                    {/* Progress bars */}
                    <IonProgressBar value={0.7} className="active-progress-football"></IonProgressBar>
                    <IonProgressBar value={1} className="total-progress-football"></IonProgressBar>

                    <div className="total-time-football">Total 93:40</div>
                </IonCardContent>
                {/* <div className="show-more-btn-football">
                    Show More
                </div> */}
            </IonCard>


            <IonCard className="stats-card">
                <IonCardTitle className="section-title">Key Players</IonCardTitle>
                <IonCardContent>
                    <div className="matchDetailPosition-top-tab-container">
                        <button
                            className={"matchDetailPosition-top-tab" + (selectedTab === "attacker" ? " matchDetailPosition-top-tab-selected" : "")}
                            onClick={() => setSelectedTab("attacker")}
                        >
                            Attacker
                        </button>
                        <button
                            className={"matchDetailPosition-top-tab" + (selectedTab === "midfielder" ? " matchDetailPosition-top-tab-selected" : "")}
                            onClick={() => setSelectedTab("midfielder")}
                        >
                            Midfielder
                        </button>
                        <button
                            className={"matchDetailPosition-top-tab" + (selectedTab === "defender" ? " matchDetailPosition-top-tab-selected" : "")}
                            onClick={() => setSelectedTab("defender")}
                        >
                            Defender
                        </button>
                    </div>

                    {selectedTab === "attacker" && (
                        <div className="players-container">
                            {/* Left Player */}
                            <div className="player-column">
                                <div className="player-avatar-container">
                                    <div>
                                        <img className='player-avatar' src={`data:image/png;base64,${homeAttacker?.avatar}`} />
                                        <div className="player-badge yellow">{homeAttacker?.rating}</div>
                                    </div>
                                </div>
                                <div className="player-name">{homeAttacker?.name}</div>
                            </div>

                            {/* Stats in the middle */}
                            <div style={{ width: "150px", display: "flex", flexDirection: "column", marginTop: "20px"}}>
                                <IonRow className="stats-column">
                                    <IonCol className="stat-item">
                                        <div className="stat-value">{homeAttacker?.expectedGoals.toFixed(2)}</div>
                                        <div className="stat-label">
                                            Expected
                                            <br />
                                            Goals
                                        </div>
                                        <div className="stat-value">{awayAttacker?.expectedGoals.toFixed(2)}</div>
                                    </IonCol>
                                </IonRow>
                                <IonRow className="stats-column">
                                    <IonCol className="stat-item">
                                        <div className="stat-value">{homeAttacker?.shot || 0}</div>
                                        <div className="stat-label">
                                            Shots On
                                            <br />
                                            Target
                                        </div>
                                        <div className="stat-value">{awayAttacker?.shot || 0}</div>
                                    </IonCol>
                                </IonRow>
                                <IonRow className="stats-column">
                                    <IonCol className="stat-item">
                                        <div className="stat-value">{homeAttacker?.min || 90}</div>
                                        <div className="stat-label">Min</div>
                                        <div className="stat-value">{awayAttacker?.min || 90}</div>
                                    </IonCol>
                                </IonRow>
                            </div>

                            {/* Right Player */}
                            <div className="player-column">
                                <div className="player-avatar-container">
                                    <div>
                                        <img className='player-avatar' src={`data:image/png;base64,${awayAttacker?.avatar}`} />
                                        <div className="player-badge blue">{awayAttacker?.rating}</div>
                                        <div className="football-icon">
                                            <IonIcon icon={footballOutline} />
                                        </div>
                                    </div>
                                </div>
                                <div className="player-name">{awayAttacker != null && awayAttacker.name}</div>
                            </div>
                        </div>
                    )}
                    {selectedTab === "midfielder" && (
                        <div className="players-container">
                            {/* Left Player */}
                            <div className="player-column">
                                <div className="player-avatar-container">
                                    <div>
                                        <img className='player-avatar' src={`data:image/png;base64,${homeMidfielder?.avatar}`} />
                                        <div className="player-badge yellow">{homeMidfielder?.rating}</div>
                                    </div>
                                </div>
                                <div className="player-name">{homeMidfielder?.name}</div>
                            </div>

                            {/* Stats in the middle */}
                            <div style={{ width: "150px", display: "flex", flexDirection: "column", marginTop: "20px" }}>
                                <IonRow className="stats-column">
                                    <IonCol className="stat-item">
                                        <div className="stat-value">{homeMidfielder?.expectedGoals.toFixed(2)}</div>
                                        <div className="stat-label">
                                            Expected
                                            <br />
                                            Goals
                                        </div>
                                        <div className="stat-value">{awayMidfielder?.expectedGoals.toFixed(2)}</div>
                                    </IonCol>
                                </IonRow>
                                <IonRow className="stats-column">
                                    <IonCol className="stat-item">
                                        <div className="stat-value">{homeMidfielder?.shot || 0}</div>
                                        <div className="stat-label">
                                            Shots On
                                            <br />
                                            Target
                                        </div>
                                        <div className="stat-value">{awayAttacker?.shot || 0}</div>
                                    </IonCol>
                                </IonRow>
                                <IonRow className="stats-column">
                                    <IonCol className="stat-item">
                                        <div className="stat-value">{homeMidfielder?.min || 90}</div>
                                        <div className="stat-label">Min</div>
                                        <div className="stat-value">{awayMidfielder?.min || 90}</div>
                                    </IonCol>
                                </IonRow>
                            </div>

                            {/* Right Player */}
                            <div className="player-column">
                                <div className="player-avatar-container">
                                    <div>
                                        <img className='player-avatar' src={`data:image/png;base64,${awayMidfielder?.avatar}`} />
                                        <div className="player-badge blue">{awayMidfielder?.rating}</div>
                                        <div className="football-icon">
                                            <IonIcon icon={footballOutline} />
                                        </div>
                                    </div>
                                </div>
                                <div className="player-name">{awayMidfielder != null && awayMidfielder.name}</div>
                            </div>
                        </div>
                    )}
                    {selectedTab === "defender" && (
                        <div className="players-container">
                            {/* Left Player */}
                            <div className="player-column">
                                <div className="player-avatar-container">
                                    <div>
                                        <img className='player-avatar' src={`data:image/png;base64,${homeDefender?.avatar}`} />
                                        <div className="player-badge yellow">{homeDefender?.rating}</div>
                                    </div>
                                </div>
                                <div className="player-name">{homeDefender?.name}</div>
                            </div>

                            {/* Stats in the middle */}
                            <div style={{ width: "150px", display: "flex", flexDirection: "column", marginTop: "20px" }}>
                                <IonRow className="stats-column">
                                    <IonCol className="stat-item">
                                        <div className="stat-value">{homeDefender?.expectedGoals.toFixed(2)}</div>
                                        <div className="stat-label">
                                            Expected
                                            <br />
                                            Goals
                                        </div>
                                        <div className="stat-value">{awayDefender?.expectedGoals.toFixed(2)}</div>
                                    </IonCol>
                                </IonRow>
                                <IonRow className="stats-column">
                                    <IonCol className="stat-item">
                                        <div className="stat-value">{homeDefender?.shot || 0}</div>
                                        <div className="stat-label">
                                            Shots On
                                            <br />
                                            Target
                                        </div>
                                        <div className="stat-value">{awayDefender?.shot || 0}</div>
                                    </IonCol>
                                </IonRow>
                                <IonRow className="stats-column">
                                    <IonCol className="stat-item">
                                        <div className="stat-value">{homeDefender?.min || 90}</div>
                                        <div className="stat-label">Min</div>
                                        <div className="stat-value">{awayDefender?.min || 90}</div>
                                    </IonCol>
                                </IonRow>
                            </div>

                            {/* Right Player */}
                            <div className="player-column">
                                <div className="player-avatar-container">
                                    <div>
                                        <img className='player-avatar' src={`data:image/png;base64,${awayDefender?.avatar}`} />
                                        <div className="player-badge blue">{awayDefender?.rating}</div>
                                        <div className="football-icon">
                                            <IonIcon icon={footballOutline} />
                                        </div>
                                    </div>
                                </div>
                                <div className="player-name">{awayDefender != null && awayDefender.name}</div>
                            </div>
                        </div>
                    )}
                </IonCardContent>
            </IonCard>
            <IonCard className="stats-card">
                <IonCardTitle className="section-title">Stats</IonCardTitle>

                <IonCardContent>
                    <div className="stats-list">
                        <div className="stat-row">
                            <IonBadge color="primary" className="stat-badge">
                                {stats.Possession?.home}
                            </IonBadge>
                            <div className="stat-name">Possession</div>
                            <div className="stat-value-right">{stats.Possession?.away}</div>
                        </div>

                        {/* <div className="stat-row">
                            <IonBadge color="primary" className="stat-badge">
                                {stats.Expected_Goals?.home}
                            </IonBadge>
                            <div className="stat-name">Expected Goals</div>
                            <div className="stat-value-right">{stats.Expected_Goals?.away}</div>
                        </div> */}

                        <div className="stat-row">
                            <IonBadge color="primary" className="stat-badge">
                                {stats.Total_shots?.home}
                            </IonBadge>
                            <div className="stat-name">Total Shots</div>
                            <div className="stat-value-right">
                                {stats.Total_shots?.away}
                            </div>
                        </div>

                        <div className="stat-row">
                            <IonBadge color="primary" className="stat-badge">
                                {stats.Shots?.home}
                            </IonBadge>
                            <div className="stat-name">Shots On Target</div>
                            <div className="stat-value-right">
                                {stats.Shots?.away}
                            </div>
                        </div>
                    </div>
                </IonCardContent>
                {/* <div className="see-all-container">
                    See All
                </div> */}
            </IonCard>
            <IonCard className="stats-card">
                <IonCardTitle className="section-title">Game Info</IonCardTitle>

                <IonCardContent className="padding-content">
                    <IonItem lines="none" className="game-info-item">
                        <div className="date-badge">
                            {matchDetail != null && matchDetail.startDate.getDate()}
                        </div>
                        <div>
                            <h2 style={{ fontSize: "12px", fontWeight: "600" }}>{matchDetail != null && matchDetail.startDate.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}</h2>
                            <p style={{ fontSize: "10px" }}>
                                {matchDetail != null && matchDetail.startDate.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                })}
                            </p>
                        </div>
                    </IonItem>

                    <IonItem lines="none" className="game-info-item">
                        <IonIcon icon={footballOutline} slot="start" className="info-icon" />
                        <div>
                            <h2 style={{ fontSize: "12px", fontWeight: "600" }}>{matchDetail != null && matchDetail.season.roundinfo}</h2>
                            <p style={{ fontSize: "10px" }}>{matchDetail != null && matchDetail.season.title}</p>
                        </div>
                    </IonItem>
                    <IonItem lines="none" className="game-info-item">
                        <IonIcon icon={personOutline} slot="start" className="info-icon" />
                        <IonLabel>
                            <h2 style={{ fontSize: "12px", fontWeight: "600" }}>{matchDetail != null && matchDetail.referee}</h2>
                            <p style={{ fontSize: "10px" }}>Referee</p>
                        </IonLabel>
                    </IonItem>

                    <IonItem lines="none" className="game-info-item">
                        <IonIcon icon={calendarOutline} slot="start" className="info-icon" />
                        <IonLabel>
                            <h2 style={{ fontSize: "12px", fontWeight: "600" }}>{matchDetail != null && matchDetail.matchCount} Leg</h2>
                        </IonLabel>
                    </IonItem>

                    <IonItem lines="none" className="game-info-item">
                        <IonIcon icon={locationOutline} slot="start" className="info-icon" />
                        <IonLabel>
                            <h2 style={{ fontSize: "12px", fontWeight: "600" }}>{matchDetail != null && matchDetail.venue.title}</h2>
                            <p style={{ fontSize: "10px" }}>Capacity: {matchDetail != null && matchDetail.venue.capacity}</p>
                        </IonLabel>
                    </IonItem>
                </IonCardContent>
            </IonCard>
        </IonContent>
    )

}
export default Detail; 