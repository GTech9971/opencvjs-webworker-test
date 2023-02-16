import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { useRef, useState } from 'react';
import './Home.css';

const Home: React.FC = () => {
  const [worker, setWorker] = useState<Worker>(new Worker('./trans.worker.js'));
  const [text, setText] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const transImgRef = useRef<HTMLImageElement>(null);

  const onClickWebworkerBtn = () => {
    worker.addEventListener('message', ({ data }) => {
      console.log(data);
      if (!transImgRef.current) { return; }
      const canvas: HTMLCanvasElement = document.createElement('canvas');
      canvas.width = data.width
      canvas.height = data.height
      const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
      ctx.putImageData(data, 0, 0);
      transImgRef.current.src = canvas.toDataURL('image/png');
    });
    console.log('init worker');
  }

  const onClickSendMessage = () => {
    if (!imgRef.current) { return; }
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = imgRef.current!.width
    canvas.height = imgRef.current!.height
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
    ctx.drawImage(imgRef.current, 0, 0);

    const data: ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    worker.postMessage(data);
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
