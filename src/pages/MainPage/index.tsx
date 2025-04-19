import { IonBadge, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonRouterOutlet, IonSegment, IonSegmentButton, IonToggle, IonToolbar } from '@ionic/react';
import { calendarOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import NoLiveGame from '../../components/NoLiveGame';
import { Route, useHistory, useLocation } from 'react-router';
import MyScorePage from '../MyScorePage';
import AllScorePage from '../AllScorePage';
import CalendarModal from '../../components/CalendarModal';
import useScrollStore from '../../stores/scroll.store';
import "./MainPage.css"

const MainPage: React.FC = () => {
  const [isLiveChecked, setIsLiveChecked] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isHidden, setHidden] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString());
  const history = useHistory();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(() => {
    // Set initial tab based on current path
    const path = location.pathname;
    if (path.includes('allscores')) return 'allscores';
    return 'myscore';
  });

  // Add this state for favorite teams
  const [favoriteTeams] = useState([1649/* Add your favorite team IDs here */]);

  // Handle initial routing
  useEffect(() => {
    if (location.pathname === '/main') {
      history.replace('/main/myscore');
    }
  }, [location.pathname, history]);



  const { scrollIsVisible } = useScrollStore();

  const handleSegmentChange = (value: string) => {
    setSelectedTab(value);
    history.push(`/main/${value}`);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };


  useEffect(() => {
    setHidden(scrollIsVisible)
  }, [scrollIsVisible]);

  return (
    <IonPage>
      <IonHeader>
        <div hidden={!isHidden}>
          <div color="dark" hidden={scrollIsVisible} className="toolbar-container" style={{ padding: '4px 0' }}>
            <IonBadge color='dark' className="toolbar-badge" style={{ padding: '2px 4px' }}>
              <IonToggle
                checked={isLiveChecked}
                onIonChange={(e) => setIsLiveChecked(e.detail.checked)}
                labelPlacement="start"
                enableOnOffLabels={true}
                className="MainPage-Toggle"
                style={{
                  '--handle-width': '16px',
                  '--handle-height': '16px',
                  '--track-height': '12px',
                  '--padding-start': '4px',
                  '--padding-end': '4px'
                }}
              >
                <span style={{ fontSize: '12px', marginRight: '4px' }}>Live</span>
              </IonToggle>
            </IonBadge>
            <IonIcon
              className="toolbar-icon"
              style={{
                width: "20px",
                height: "20px",
                padding: '2px'
              }}
              icon={calendarOutline}
              onClick={() => setIsCalendarOpen(true)}
            />
          </div>
        </div>
        <div className="mainPage-tab-container">
          <button
            className={"mainPage-top-tab" + (selectedTab === "myscore" ? " mainPage-top-tab-selected" : "")}
            onClick={() => handleSegmentChange("myscore")}
          >
            MY SCORES
          </button>
          <button
            className={"mainPage-top-tab" + (selectedTab === "allscores" ? " mainPage-top-tab-selected" : "")}
            onClick={() => handleSegmentChange("allscores")}
          >
            ALL SCORES
          </button>
        </div>
      </IonHeader>
      <IonContent>
        {isLiveChecked ? (
          <NoLiveGame />
        ) : (
          <IonRouterOutlet>
            <Route exact path="/main/myscore" component={MyScorePage} />
            <Route exact path="/main/allscores" component={AllScorePage} />
          </IonRouterOutlet>
        )}
      </IonContent>

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onDateSelect={handleDateSelect}
        favoriteTeams={favoriteTeams}
      />
    </IonPage>
  );
};

export default MainPage;
