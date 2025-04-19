import type React from "react"
import { useEffect, useState } from "react"
import { IonSegment, IonSegmentButton, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonContent, IonPage, IonImg, IonCard, IonHeader, IonCardHeader, IonCardContent } from "@ionic/react"
import { homeOutline, personOutline, notificationsOutline, settingsOutline, play } from "ionicons/icons"
import { IonReactRouter } from "@ionic/react-router"
import { Route, Redirect } from "react-router-dom"
import "./PlayerCard.css"
import EachCountryCard from "../../../EachCountryCard"
import EachPlayerCard from "../EachPlayerCard"
import { element } from "prop-types"

// Tab content components
interface DetailProps {
    propsData: any;
    kind: "C" | "B" | "M" | "S"
}
const PlayerCard: React.FC<DetailProps> = ({ propsData, kind }) => {
    const [selectedPlayers, setSelectedPlayers] = useState<any>([]);

    useEffect(() => {
        if (!propsData) {
            setSelectedPlayers([]);
            return;
        }

        let temp: any = [];
        if (kind === "C") {
            if (propsData?.id && propsData?.name && propsData?.country) {
                temp.push({
                    player: {
                        id: propsData.id,
                        name: propsData.name,
                        country: propsData.country,
                        jerseyNumber: ''
                    }
                });
            }
        } else {
            const tempPropsData = Array.isArray(propsData) ? propsData : [];

            tempPropsData.forEach((element: any) => {
                if (!element?.player) return;

                if (kind === "M") {
                    temp.push(element);
                } else {
                    const substitute_rule = element.statistics?.rating != null && 
                                         element.statistics?.minutesPlayed < 90;
                    const bench_rule = !element.statistics?.minutesPlayed;

                    switch (kind) {
                        case "S":
                            if (substitute_rule) {
                                temp.push(element);
                            }
                            break;
                        case "B":
                            if (bench_rule) {
                                temp.push(element);
                            }
                            break;
                    }
                }
            });
        }

        if (kind === "S") {
            let temp1: any = [];
            let dropOutData: any = [];
            let comeInData: any = [];

            temp.forEach((element: any) => {
                if (element?.substitute === false) {
                    dropOutData.push(element);
                } else if (element?.player) {
                    comeInData.push(element);
                }
            });

            dropOutData.forEach((value: any, index: number) => {
                if (comeInData[index]?.player) {
                    let temp2 = value;
                    temp2 = {
                        ...temp2,
                        after: {
                            name: comeInData[index].player.name,
                            jerseyNumber: comeInData[index].player.jerseyNumber
                        }
                    };
                    temp1.push({ ...temp2 });
                }
            });
            temp = temp1;
        }
        setSelectedPlayers(temp);
    }, [propsData, kind]);

    return (
        <IonCard className="player_card">
            <IonCardHeader className="player_card_header">
                {(() => {
                    switch (kind) {
                        case "C":
                            return "Coaching";
                        case "S":
                            return "Substitutions";
                        case "B":
                            return "Bench";
                        default:
                            return "Missing Players";
                    }
                })()}
            </IonCardHeader>
            <IonCardContent className="player_card_content">
                {selectedPlayers.map((element: any, index: number) => (
                    element?.player && <EachPlayerCard key={index} data={element} type={kind} />
                ))}
            </IonCardContent>
        </IonCard>
    );
}

export default PlayerCard;
