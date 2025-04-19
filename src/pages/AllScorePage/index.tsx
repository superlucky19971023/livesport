import { IonButton, IonContent, IonIcon, IonLabel, IonPage, IonRouterOutlet, IonRow, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import React from "react";
import { football, baseball, basketball, tennisball, americanFootball, disc } from 'ionicons/icons';
import { useEffect, useState } from "react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router";
import FootballPage from "../../components/AllScorePage/FootballPage";
import BaseballPage from "../../components/AllScorePage/BaseballPage";
import BasketballPage from "../../components/AllScorePage/BasketballPage";
import TennisPage from "../../components/AllScorePage/TennisPage";
import AmericanFootballPage from "../../components/AllScorePage/AmericanFootballPage";
import HockeyPage from "../../components/AllScorePage/HockeyPage";
import RugbyPage from "../../components/AllScorePage/RugbyPage";
import CricketPage from "../../components/AllScorePage/CricketPage";
import VolleyballPage from "../../components/AllScorePage/VolleyballPage";
import "./AllScorePage.css";
import MatchDetailPage from "../MatchDetailPage";

const AllScorePage: React.FC = () => {
  const sportTabs: SportTab[] = [
    { id: "football", label: "Football", icon: football },
    { id: "baseball", label: "Baseball", icon: baseball },
    { id: "basketball", label: "Basketball", icon: basketball },
    { id: "tennis", label: "Tennis", icon: tennisball },
    { id: "a-football", label: "A Football", icon: americanFootball },
    { id: "hockey", label: "Hockey", icon: disc },
    { id: "rugby", label: "Rugby", icon: football },
    { id: "cricket", label: "Cricket", icon: disc },
    // { id: "volleyball", label: "Volleyball", icon: "volleyball" },
  ];

  const [selectedTab, setSelectedTab] = useState<string>("football");
  const [contentData, setContentData] = useState<React.FC>();

  useEffect(()=>{
    
  },[selectedTab])

  return (
    <IonPage>
      <IonContent className="allScorePage-content">
        <IonRow className="horizontal-scroll-tab-bar">
          {sportTabs.map((tab) => (
            <div
              className="allScorePage-header-item"
              key={tab.id}
              // tab={tab.id}
              // href={`/main/allscores/${tab.id}`}
              // selected={selectedTab === tab.id}
              onClick={() => setSelectedTab(tab.id)}
            >
              <IonIcon icon={tab.icon} style={{ fontSize: "16px"}}/>
              <IonLabel className="allScorePage-header-label">{tab.label}</IonLabel>
            </div>
          ))}
        </IonRow>
        <div>
          {
            (() => {
              switch (selectedTab) {
                case "football":
                  return <FootballPage />
                case "baseball":
                  return <BaseballPage />
                case "basketball":
                  return <BasketballPage />
                case "tennis":
                  return <TennisPage />
                case "a-football":
                  return <AmericanFootballPage />
                case "hockey":
                  return <HockeyPage />
                case "rugby":
                  return <RugbyPage />
                case "cricket":
                  return <CricketPage />
                case "volleyball":
                  return <VolleyballPage />
              }
            })()
          }
          {/* <IonRouterOutlet>
            <Route exact path="/main/allscores/football" component={FootballPage} />
            <Route exact path="/main/allscores/baseball" component={BaseballPage} />
            <Route exact path="/main/allscores/basketball" component={BasketballPage} />
            <Route exact path="/main/allscores/tennis" component={TennisPage} />
            <Route exact path="/main/allscores/a-football" component={AmericanFootballPage} />
            <Route exact path="/main/allscores/hockey" component={HockeyPage} />
            <Route exact path="/main/allscores/rugby" component={RugbyPage} />
            <Route exact path="/main/allscores/cricket" component={CricketPage} />
            <Route exact path="/main/allscores/volleyball" component={VolleyballPage} />
            <Route exact path="/match-detail" component={MatchDetailPage} />
            <Route exact path="/main/allscores">
              <Redirect to="/main/allscores/football" />
            </Route>
          </IonRouterOutlet> */}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AllScorePage;