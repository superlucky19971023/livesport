import type React from "react"
import { useEffect, useState } from "react"
import { IonSegment, IonSegmentButton, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonContent, IonPage, IonImg, IonCard, IonHeader, IonCardHeader, IonCardContent } from "@ionic/react"
import { homeOutline, personOutline, notificationsOutline, settingsOutline } from "ionicons/icons"
import { IonReactRouter } from "@ionic/react-router"
import { Route, Redirect } from "react-router-dom"
import "./EachPlayerCard.css"
import { fetchData, getImageData } from "../../../../apiServices"
import { element } from "prop-types"

// Tab content components
interface DetailProps {
    data: any; // Replace 'any' with a proper type if possible
    type: string
}
const EachPlayerCard: React.FC<DetailProps> = ({ data, type }) => {

    const [userAvatar, setUserAvatar] = useState<string>("");

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                if (type === "C") {
                    // For managers/coaching staff
                    const managerAvatar = await getImageData(`manager/${data.player.id}/image`);
                    setUserAvatar(managerAvatar);
                } else {
                    // For players
                    const avatar = await getImageData(`player/${data.player.id}/image`);
                    setUserAvatar(avatar);
                }
            } catch (error) {
                console.error('Error fetching avatar:', error);
                setUserAvatar(""); // Set empty string if image fetch fails
            }
        })();
    }, [data, type]);


    return (
        <div className="each_player_card">
            <div className="player_left">
                <div className="player_avatar">
                    <img src={`data:image/png;base64,${userAvatar}`} className="avatar_image"></img>
                    <img src={`flag/flag_${data.player.country.alpha2.toLowerCase()}.png`} className="country_flag"></img>
                </div>
                <div className="player_private_info">
                    <div className="player_number">
                        <div className="number1">{data.player.jerseyNumber}</div>
                        {type == "S" && <div className="number2">{data.after.jerseyNumber}</div>}
                    </div>
                    <div className="player_name">
                        <div className={type == "S" ? "name1" : "name3"}>{data.player.name}</div>
                        {type == "S" && <div className="name2">{data.after.name}</div>}
                    </div>
                </div>
            </div>
            {/* <div className="player_propertity">
                <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><path fill="currentColor" d="M30.88 9.794c-2.876-3.639-7.196-5.726-11.853-5.726a14.917 14.917 0 0 0-9.338 3.243l-.098.078l.662.839l.098-.078a13.855 13.855 0 0 1 8.676-3.014c4.328 0 8.342 1.939 11.015 5.32c4.792 6.066 3.757 14.9-2.308 19.693a14.003 14.003 0 0 1-8.648 2.984a14 14 0 0 1-10.257-4.43l5.972.614l.109-1.062l-7.825-.805l-.136-.015l-.077 7.945l1.062.148l-.03-6.256c2.845 3.129 6.872 4.927 11.185 4.927c3.381 0 6.687-1.141 9.307-3.213c6.526-5.156 7.641-14.663 2.484-21.192"/></svg>
                </div>
                <div></div>
            </div> */}
        </div>
    )
}

export default EachPlayerCard;