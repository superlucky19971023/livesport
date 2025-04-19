import type React from "react"
import { useEffect, useState } from "react"
import { IonAvatar, IonContent, IonImg } from "@ionic/react"
import PlayerCard from "./PlayerCard"
import "./Lineups.css"
import { fetchData, getImageData } from "../../../apiServices"

// Tab content components

interface DetailProps {
    data: any; // Replace 'any' with a proper type if possible
    homeTeam?: string,
    awayTeam?: string
}

interface Player {
    player: {
        id: number;
        name: string;
        jerseyNumber: string;
    };
    position: string;
}

const LineUps: React.FC<DetailProps> = ({ data, homeTeam, awayTeam }) => {

    const [selectedTeam, setSelectedTeam] = useState<any>(null)
    const [players, setPlayers] = useState<any>(null);
    const [format, setFormat] = useState<string>("");
    const [buttonFlag, setButtonFlag] = useState<boolean>(true);
    const [missingPlayers, setMissingPlayers] = useState<any>(null);
    const [coaching, setCoaching] = useState<any>(null);
    const [type, setType] = useState<string>("home");
    const [playerImages, setPlayerImages] = useState<{ [key: string]: string }>({});

    const getPositionCoordinates = (position: string, formation: string) => {
        console.log(position, formation);
        if (!getPositionCoordinates.usedPositions) {
            getPositionCoordinates.usedPositions = new Set();
        }
        const formations: { [key: string]: { [key: string]: { x: number, y: number } } } = {
            "4-4-2": {
                "G": { x: 50, y: 90 },
                "D1": { x: 15, y: 70 },
                "D2": { x: 35, y: 70 },
                "D3": { x: 65, y: 70 },
                "D4": { x: 85, y: 70 },
                "M1": { x: 15, y: 45 },
                "M2": { x: 35, y: 45 },
                "M3": { x: 65, y: 45 },
                "M4": { x: 85, y: 45 },
                "F1": { x: 35, y: 20 },
                "F2": { x: 65, y: 20 }
            },
            "4-1-4-1": {
                "G": { x: 50, y: 90 },
                "D1": { x: 15, y: 70 },
                "D2": { x: 35, y: 70 },
                "D3": { x: 65, y: 70 },
                "D4": { x: 85, y: 70 },
                "M1": { x: 50, y: 55 },  // Defensive midfielder
                "M2": { x: 15, y: 40 },
                "M3": { x: 35, y: 40 },
                "M4": { x: 65, y: 40 },
                "M5": { x: 85, y: 40 },
                "F1": { x: 50, y: 20 }
            },
            "4-3-3": {
                "G": { x: 50, y: 90 },
                "D1": { x: 15, y: 70 },
                "D2": { x: 35, y: 70 },
                "D3": { x: 65, y: 70 },
                "D4": { x: 85, y: 70 },
                "M1": { x: 25, y: 45 },
                "M2": { x: 50, y: 45 },
                "M3": { x: 75, y: 45 },
                "F1": { x: 25, y: 20 },
                "F2": { x: 50, y: 20 },
                "F3": { x: 75, y: 20 }
            },
            "4-2-3-1": {
                "G": { x: 50, y: 90 },
                "D1": { x: 15, y: 65 },
                "D2": { x: 35, y: 70 },
                "D3": { x: 65, y: 70 },
                "D4": { x: 85, y: 65 },
                "M1": { x: 35, y: 50 },
                "M2": { x: 65, y: 50 },
                "M3": { x: 25, y: 35 },
                "M4": { x: 50, y: 35 },
                "M5": { x: 75, y: 35 },
                "F1": { x: 50, y: 20 }
            },
            "5-4-1": {
                "G": { x: 50, y: 90 },
                "D1": { x: 10, y: 65 },
                "D2": { x: 30, y: 70 },
                "D3": { x: 50, y: 70 },
                "D4": { x: 70, y: 70 },
                "D5": { x: 90, y: 65 },
                "M1": { x: 20, y: 35 },
                "M2": { x: 40, y: 40 },
                "M3": { x: 60, y: 40 },
                "M4": { x: 80, y: 35 },
                "F1": { x: 50, y: 20 }
            },
            "3-5-2": {
                "G": { x: 50, y: 90 },
                "D1": { x: 25, y: 70 },
                "D2": { x: 50, y: 70 },
                "D3": { x: 75, y: 70 },
                "M1": { x: 15, y: 45 },
                "M2": { x: 35, y: 45 },
                "M3": { x: 50, y: 45 },
                "M4": { x: 65, y: 45 },
                "M5": { x: 85, y: 45 },
                "F1": { x: 35, y: 20 },
                "F2": { x: 65, y: 20 }
            },
            "3-4-3": {
                "G": { x: 50, y: 90 },
                "D1": { x: 25, y: 70 },
                "D2": { x: 50, y: 70 },
                "D3": { x: 75, y: 70 },
                "M1": { x: 20, y: 45 },
                "M2": { x: 40, y: 45 },
                "M3": { x: 60, y: 45 },
                "M4": { x: 80, y: 45 },
                "F1": { x: 25, y: 20 },
                "F2": { x: 50, y: 20 },
                "F3": { x: 75, y: 20 }
            },
            "4-6-0": {
                "G": { x: 50, y: 90 },
                "D1": { x: 15, y: 70 },
                "D2": { x: 35, y: 70 },
                "D3": { x: 65, y: 70 },
                "D4": { x: 85, y: 70 },
                "M1": { x: 10, y: 45 },
                "M2": { x: 28, y: 45 },
                "M3": { x: 46, y: 45 },
                "M4": { x: 54, y: 45 },
                "M5": { x: 72, y: 45 },
                "M6": { x: 90, y: 45 }
            },
            "5-3-2": {
                "G": { x: 50, y: 90 },
                "D1": { x: 10, y: 70 },
                "D2": { x: 30, y: 70 },
                "D3": { x: 50, y: 70 },
                "D4": { x: 70, y: 70 },
                "D5": { x: 90, y: 70 },
                "M1": { x: 25, y: 45 },
                "M2": { x: 50, y: 45 },
                "M3": { x: 75, y: 45 },
                "F1": { x: 35, y: 20 },
                "F2": { x: 65, y: 20 }
            },
            "3-6-1": {
                "G": { x: 50, y: 90 },
                "D1": { x: 25, y: 70 },
                "D2": { x: 50, y: 70 },
                "D3": { x: 75, y: 70 },
                "M1": { x: 10, y: 45 },
                "M2": { x: 28, y: 45 },
                "M3": { x: 46, y: 45 },
                "M4": { x: 54, y: 45 },
                "M5": { x: 72, y: 45 },
                "M6": { x: 90, y: 45 },
                "F1": { x: 50, y: 20 }
            },
            "4-3-1-2": {
                "G": { x: 50, y: 90 },
                "D1": { x: 15, y: 70 },
                "D2": { x: 35, y: 70 },
                "D3": { x: 65, y: 70 },
                "D4": { x: 85, y: 70 },
                "M1": { x: 25, y: 50 },
                "M2": { x: 50, y: 50 },
                "M3": { x: 75, y: 50 },
                "M4": { x: 50, y: 35 },  // Advanced midfielder/CAM
                "F1": { x: 35, y: 20 },
                "F2": { x: 65, y: 20 }
            },
            "4-2-4": {
                "G": { x: 50, y: 90 },
                "D1": { x: 15, y: 70 },
                "D2": { x: 35, y: 70 },
                "D3": { x: 65, y: 70 },
                "D4": { x: 85, y: 70 },
                "M1": { x: 35, y: 45 },
                "M2": { x: 65, y: 45 },
                "F1": { x: 15, y: 20 },
                "F2": { x: 40, y: 20 },
                "F3": { x: 60, y: 20 },
                "F4": { x: 85, y: 20 }
            },
            "4-5-1": {
                "G": { x: 50, y: 90 },
                "D1": { x: 15, y: 70 },
                "D2": { x: 35, y: 70 },
                "D3": { x: 65, y: 70 },
                "D4": { x: 85, y: 70 },
                "M1": { x: 10, y: 45 },
                "M2": { x: 30, y: 45 },
                "M3": { x: 50, y: 45 },
                "M4": { x: 70, y: 45 },
                "M5": { x: 90, y: 45 },
                "F1": { x: 50, y: 20 }
            }, 
            "4-4-1-1": {
                "G": { x: 50, y: 90 },
                "D1": { x: 15, y: 65 },
                "D2": { x: 35, y: 70 },
                "D3": { x: 65, y: 70 },
                "D4": { x: 85, y: 65 },
                "M1": { x: 15, y: 35 },
                "M2": { x: 35, y: 42 },
                "M3": { x: 65, y: 42 },
                "M4": { x: 85, y: 35 },
                "F1": { x: 50, y: 25 },  // Second striker/CAM
                "F2": { x: 50, y: 15 }   // Main striker
            },
        };

        // Default to 4-4-2 if formation not found
        const formationData = formations[formation] || formations["4-4-2"];

        const getPositionsForLine = (posType: string) => {
            return Object.entries(formationData)
                .filter(([key, value]) => key.startsWith(posType))
                .map(([key, value]) => ({ key, value }))
                .sort((a, b) => a.value.x - b.value.x); // Sort by x coordinate
        };

        const findNextPosition = (posType: string) => {
            const linePositions = getPositionsForLine(posType);
            for (let pos of linePositions) {
                const coordKey = `${pos.value.x},${pos.value.y}`;
                if (!getPositionCoordinates.usedPositions.has(coordKey)) {
                    getPositionCoordinates.usedPositions.add(coordKey);
                    return pos.value;
                }
            }
            return linePositions[0].value; // Fallback to first position if all taken
        };

        const posType = position.charAt(0);
        const coords = findNextPosition(posType);

        return coords;
    };

    useEffect(() => {
        if (data != null) {
            const fetchDatas = async (): Promise<void> => {
                try {
                    if (getPositionCoordinates.usedPositions) {
                        getPositionCoordinates.usedPositions.clear();
                    }

                    const apiPlayers = await fetchData(`match/${data.id}/lineups`);
                    console.log('API Response:', apiPlayers); // Debug log

                    if (!apiPlayers || !apiPlayers.home || !apiPlayers.home.players) {
                        console.error('Invalid API response structure:', apiPlayers);
                        return;
                    }

                    setPlayers(apiPlayers);
                    setSelectedTeam(apiPlayers.home.players);
                    setFormat(apiPlayers.home.formation);
                    setMissingPlayers(apiPlayers.home.missingPlayers);

                    const apiCoaching = await fetchData(`match/${data.id}`);
                    if (apiCoaching?.event?.homeTeam?.manager) {
                        setCoaching(apiCoaching.event.homeTeam.manager);
                    }

                    const images: { [key: string]: string } = {};
                    // Add null check for players array
                    if (Array.isArray(apiPlayers.home.players)) {
                        for (const player of apiPlayers.home.players) {
                            if (player?.player?.id) {  // Add safety check
                                try {
                                    const image = await getImageData(`player/${player.player.id}/image`);
                                    images[player.player.id] = image;
                                } catch (error) {
                                    console.error(`Error fetching image for player ${player.player.id}:`, error);
                                }
                            }
                        }
                    }
                    if (Array.isArray(apiPlayers.away.players)) {
                        for (const player of apiPlayers.away.players) {
                            if (player?.player?.id) {
                                try {
                                    const image = await getImageData(`player/${player.player.id}/image`);
                                    images[player.player.id] = image;
                                } catch (error) {
                                    console.error(`Error fetching image for player ${player.player.id}:`, error);
                                }
                            }
                        }
                    }
                    setPlayerImages(images);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchDatas();
        }
    }, [data])

    const handleClick = async (team: string) => {
        setButtonFlag(!buttonFlag);
        setType(team);
        if (players && players[team] && players[team].players) {  // Add safety checks
            setSelectedTeam(players[team].players);
            setFormat(players[team].formation);
            setMissingPlayers(players[team].missingPlayers);

            try {
                const apiCoaching = await fetchData(`match/${data.id}`);
                if (apiCoaching?.event?.[`${team}Team`]?.manager) {
                    setCoaching(apiCoaching.event[`${team}Team`].manager);
                }
            } catch (error) {
                console.error("Error fetching coaching data:", error);
            }
        }
    }

    console.log(selectedTeam)

    return (
        <IonContent className="line_Ups">
            <div className="switchBox">
                <div className="segement">
                    <div className={buttonFlag ? "button-after-checked" : "button-checked"} onClick={() => handleClick("home")}>{data.homeTeam}</div>
                    <div className={!buttonFlag ? "button-after-checked" : "button-checked"} onClick={() => handleClick("away")}>{data.awayTeam}</div>
                </div>
            </div>

            <div style={{ position: "relative" }}>
                {/* <IonImg src="img/background.png">
                </IonImg> */}
                <div className="formation-field">
                    <div className="field-background">
                        <img src="/img/background.png" alt="Soccer field" />
                        {selectedTeam && Array.isArray(selectedTeam) && selectedTeam
                            .filter((player: Player) => {
                                // Only show players who:
                                // 1. Are in the starting lineup (substitute === false)
                                // 2. Haven't been substituted out
                                return !player.substitute &&
                                    (!player.statistics?.minutesPlayed ||
                                        player.statistics.minutesPlayed > 0);
                            })
                            .map((player: Player, index: number) => {
                                if (!player?.player?.id || !player?.position) {
                                    console.warn('Invalid player data:', player);
                                    return null;
                                }

                                const coords = getPositionCoordinates(player.position, format);
                                return (
                                    <div
                                        key={player.player.id || index}
                                        className="player-marker"
                                        style={{
                                            left: `${coords.x}%`,
                                            top: `${coords.y}%`
                                        }}
                                    >
                                        <div className="player-avatar">
                                            <IonAvatar>
                                                <img
                                                    src={playerImages[player.player.id]
                                                        ? `data:image/png;base64,${playerImages[player.player.id]}`
                                                        : '/assets/default-player.png'
                                                    }
                                                    alt={player.player.shortName || 'Player'}
                                                />
                                            </IonAvatar>
                                            <span className="player-number">{player.player?.jerseyNumber || ''}</span>
                                        </div>
                                        <div className="player-name-line-up">{player.player?.shortName || 'Unknown Player'}</div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
                <div style={{ position: "absolute", bottom: "40px", left: "20px" }}>{format}</div>
            </div>

            <div>
                <PlayerCard key={"PlayerCard1"} propsData={coaching} kind="C" />
                <PlayerCard key={"PlayerCard2"} propsData={selectedTeam} kind="S" />
                <PlayerCard key={"PlayerCard3"} propsData={selectedTeam} kind="B" />
                <PlayerCard key={"PlayerCard4"} propsData={missingPlayers} kind="M" />
            </div>
        </IonContent>
    )
}

export default LineUps;
