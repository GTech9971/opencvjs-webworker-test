import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { useRef, useState } from 'react';
import './Home.css';

export interface Message {
  type: 'init' | 'putImg' | 'trans',
  data: any,
}

const Home: React.FC = () => {
  const [worker, setWorker] = useState<Worker>(new Worker('./trans.worker.js'));
  const imgRef = useRef<HTMLImageElement>(null);
  const transImgRef = useRef<HTMLImageElement>(null);


  worker.addEventListener('message', (event: any) => {
    const { type, data } = event.data as Message;
    switch (type) {
      case 'init': {
        console.log(data);
        break;
      }
      case 'putImg':
      case 'trans': {
        if (!transImgRef.current) { return; }
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = data.width
        canvas.height = data.height
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
        ctx.putImageData(data, 0, 0);
        transImgRef.current.src = canvas.toDataURL('image/png');
        break;
      }
    }
  });


  const onClickWebworkerBtn = () => {
    console.log('init worker');
    const message: Message = { type: 'init', data: null };
    worker.postMessage(message);
  }

  const onClickSendMessage = () => {
    if (!imgRef.current) { return; }
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = 1280
    canvas.height = 720
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
    ctx.drawImage(imgRef.current, 0, 0);

    const data: ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const message: Message = { type: 'putImg', data: data };
    worker.postMessage(message);
  }

  const onClickTransform = () => {
    if (!imgRef.current) { return; }
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = 1280
    canvas.height = 720
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
    ctx.drawImage(imgRef.current, 0, 0);

    const data: ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const message: Message = { type: 'trans', data: data };
    worker.postMessage(message);
  };

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
          <IonLabel>RGB2BGR</IonLabel>
          <IonButton onClick={onClickSendMessage}>send message</IonButton>
        </IonItem>

        <IonItem>
          <IonLabel>Image transform</IonLabel>
          <IonButton onClick={onClickTransform}>Transform</IonButton>
        </IonItem>

        <IonGrid>
          <IonRow>
            <IonCol size='6'>
              <img ref={imgRef} src='./img.png' alt='original img' />
            </IonCol>
            <IonCol size='6'>
              <img ref={transImgRef} alt='transform img' />
            </IonCol>
          </IonRow>
        </IonGrid>

      </IonContent>
    </IonPage>
  );
};

export default Home;
