import type React from "react"
import { useEffect, useState } from "react"
import { IonCard, IonCardHeader, IonCardContent } from "@ionic/react"
import "./EachStatsCard.css"

// Tab content components
interface statsPropsType {
    data: any
}

const EachStatsCard: React.FC<statsPropsType> = ({ data }) => {

    return (
        <div className="eachStatsCard_container">
            <div className={data.home > data.away ? "winner_score" : "loser_score"}>{data.home}</div>
            <div className="eachStatsCard_name">{data.name}</div>
            <div className={data.home < data.away ? "winner_score" : "loser_score"}>{data.away}</div>
        </div>
    )
}

export default EachStatsCard;