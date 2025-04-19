import { noLiveGame } from '../../utils/const';
import { IonToggle } from '@ionic/react';

const NoLiveGame: React.FC = () => {
  return (
    <div className="container">
      <IonToggle
        className='contain-toggle'
        checked
        labelPlacement="start"
        disabled
      >
        Live
      </IonToggle>
      <strong>{noLiveGame}</strong>
    </div>
  );
};

export default NoLiveGame;
