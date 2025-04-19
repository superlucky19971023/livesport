import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import MainPage from "../pages/MainPage";
import MatchDetailPage from "../pages/MatchDetailPage";
import PlayDetailView from "../pages/PlayDetailView";
import SignIn from "../pages/Auth/SignIn";
import SignUp from "../pages/Auth/SignUp";
import PaymentPage from "../pages/PaymentPage";
import AddCardWrapper from "../pages/AddCard/AddCardWrapper";
import SubscriptionPaymentWrapper from "../pages/SubscriptionPayment/SubscriptionPaymentWrapper";

const Routing: React.FC = () => {


  return (
    <IonReactRouter>
      <Route path='/addcard' component={AddCardWrapper} />
      <Route path='/subscribe' component={SubscriptionPaymentWrapper} />
      <Route path="/main" component={MainPage} />
      <Route path="/match-detail" component={MatchDetailPage} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path='/payment' component={PaymentPage} />
      <Route path="/playdetail/:detail" component={PlayDetailView} />
      <Route exact path="/">
        <Redirect to="/signin"  />
      </Route>
    </IonReactRouter>
  );
};

export default Routing;