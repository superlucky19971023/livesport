import type React from "react"
import { useEffect, useState } from "react"
import { IonCard, IonCardHeader, IonCardContent } from "@ionic/react"
import "./StatsCard.css"
import EachStatsCard from "../EachStatsCard"

// Tab content components
interface statsPropsType {
    header: string,
    transform: any
}

const StatsCard: React.FC<statsPropsType> = ({ header, transform }) => {


    return (
        <IonCard className="stats_card">
            <IonCardHeader className="stats_card_header">
                {header}
            </IonCardHeader>
            <IonCardContent className="stats_card_content">
                {
                    transform.map((element: any) => {
                        return <EachStatsCard data={element}></EachStatsCard>
                    })
                }
            </IonCardContent>
        </IonCard>
    )
}

export default StatsCard;