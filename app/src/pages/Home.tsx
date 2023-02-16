import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import './Home.css';

const Home: React.FC = () => {
  const [worker, setWorker] = useState<Worker>(new Worker('./trans.worker.js'));
  const [text, setText] = useState<string>('');

  const onClickWebworkerBtn = () => {
    worker.addEventListener('message', ({ data }) => {
      console.log(data);
    });
    console.log('init worker');
  }

  const onClickSendMessage = () => {
    worker.postMessage(text);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonButton onClick={onClickWebworkerBtn}>Start worker</IonButton>
        <IonItem>
          <IonLabel>Input message</IonLabel>
          <IonInput type='text'
            value={text}
            onIonInput={(e: any) => { setText(e.target.value) }}
            placeholder='input send message' />
          <IonButton onClick={onClickSendMessage}>send message</IonButton>
        </IonItem>

        <IonGrid>
          <IonRow>
            <IonCol size='6'>
              <img src='./img.png' alt='original img' />
            </IonCol>
            <IonCol size='6'>
              <img src='' alt='transform img' />
            </IonCol>
          </IonRow>
        </IonGrid>

      </IonContent>
    </IonPage>
  );
};

export default Home;
