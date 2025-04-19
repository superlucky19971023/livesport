import type React from "react"
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonLabel,
  IonImg,
} from "@ionic/react"
import "./MatchCard.css"


import EachMatchDetailCard from "../EachMatchDetailCard";
import { useEffect, useState } from "react";
import { getImageData } from "../../apiServices";

const MatchCard: React.FC<Competition> = ({ key, kind, name, icon, matches }) => {

  const [leagueLogo, setLeagueLogo] = useState<string>("");

  useEffect(() => {
    if (icon != null || icon != undefined) {
      (async (): Promise<void> => {
        const logo = await getImageData(`tournament/${icon}/image`);
        setLeagueLogo("data:image/png;base64," + logo)
      }
      )()
    }
  }, [icon])
  return (
    <IonCard className="competition-card" key={key}>
      <IonCardHeader className="competition-header">
        {icon && <IonImg src={leagueLogo} className="competition-logo" />}
        <IonLabel className="competition-title">{name}</IonLabel>
      </IonCardHeader>

      <IonCardContent className="competition-content">
        {matches.map((match, index) => (
          <EachMatchDetailCard kind={kind} match={match} index={index} name = {name} length={matches.length} icon={leagueLogo} />
        ))}
      </IonCardContent>
    </IonCard>
  )
}

export default MatchCard;