"use client"

import type React from "react"
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonContent, IonPage } from "@ionic/react"
import { homeOutline, personOutline, notificationsOutline, settingsOutline } from "ionicons/icons"
import { IonReactRouter } from "@ionic/react-router"
import { Route, Redirect } from "react-router-dom"

// Tab content components
const HomeTab: React.FC = () => (
  <IonPage>
    <IonContent className="ion-padding">
      <h1>Home</h1>
      <p>Welcome to the home tab!</p>
      <div className="flex flex-col gap-4 mt-4">
        <div className="h-32 rounded-lg bg-primary/10 flex items-center justify-center">Featured Content</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 rounded-lg bg-primary/10 flex items-center justify-center">Quick Action 1</div>
          <div className="h-24 rounded-lg bg-primary/10 flex items-center justify-center">Quick Action 2</div>
        </div>
      </div>
    </IonContent>
  </IonPage>
)

const ProfileTab: React.FC = () => (
  <IonPage>
    <IonContent className="ion-padding">
      <h1>Profile</h1>
      <p>Your profile information</p>
      <div className="flex flex-col items-center mt-4">
        <div className="w-24 h-24 rounded-full bg-primary/10 mb-4"></div>
        <h2 className="text-xl font-bold">John Doe</h2>
        <p className="text-muted-foreground">john.doe@example.com</p>
        <div className="w-full mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-card">
            <h3 className="font-medium">Account Settings</h3>
          </div>
          <div className="p-4 rounded-lg bg-card">
            <h3 className="font-medium">Privacy</h3>
          </div>
          <div className="p-4 rounded-lg bg-card">
            <h3 className="font-medium">Notifications</h3>
          </div>
        </div>
      </div>
    </IonContent>
  </IonPage>
)

const NotificationsTab: React.FC = () => (
  <IonPage>
    <IonContent className="ion-padding">
      <h1>Notifications</h1>
      <p>Your recent notifications</p>
      <div className="space-y-4 mt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-lg bg-card">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10"></div>
              <div>
                <h3 className="font-medium">Notification Title {i}</h3>
                <p className="text-sm text-muted-foreground">This is a sample notification message.</p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </IonContent>
  </IonPage>
)

const SettingsTab: React.FC = () => (
  <IonPage>
    <IonContent className="ion-padding">
      <h1>Settings</h1>
      <p onClick={() => {Redirect()}}>Adjust your app settings</p>
      <div className="space-y-6 mt-4">
        <div>
          <h2 className="text-lg font-medium mb-2">Appearance</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-card">
              <span>Dark Mode</span>
              <div className="w-10 h-6 bg-primary/30 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-card">
              <span>Text Size</span>
              <span className="text-sm">Medium</span>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-medium mb-2">Notifications</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-card">
              <span>Push Notifications</span>
              <div className="w-10 h-6 bg-primary rounded-full"></div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-card">
              <span>Email Alerts</span>
              <div className="w-10 h-6 bg-primary/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </IonContent>
  </IonPage>
)

export default function TabContainer() {
  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/tabs/home">
            <HomeTab />
          </Route>
          <Route exact path="/tabs/profile">
            <ProfileTab />
          </Route>
          <Route exact path="/tabs/notifications">
            <NotificationsTab />
          </Route>
          <Route path="/tabs/settings">
            <SettingsTab />
          </Route>
          <Route exact path="/tabs">
            <Redirect to="/tabs/home" />
          </Route>
        </IonRouterOutlet>

        <IonTabBar slot="top" className="border-t">
          <IonTabButton tab="home" href="/tabs/home">
            <IonIcon icon={homeOutline} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>

          <IonTabButton tab="profile" href="/tabs/profile">
            <IonIcon icon={personOutline} />
            <IonLabel>Profile</IonLabel>
          </IonTabButton>

          <IonTabButton tab="notifications" href="/tabs/notifications">
            <IonIcon icon={notificationsOutline} />
            <IonLabel>Notifications</IonLabel>
          </IonTabButton>

          <IonTabButton tab="settings" href="/tabs/settings">
            <IonIcon icon={settingsOutline} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  )
}

