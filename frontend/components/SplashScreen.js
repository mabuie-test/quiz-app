// frontend/components/SplashScreen.js
import { useEffect } from 'react';
import styles from './SplashScreen.module.css';

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    // Após 3.5s dispara onFinish para ocultar o splash
    const timer = setTimeout(onFinish, 3500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={styles.splash}>
      <h1 className={styles.message}>
        Bem‑vindo ao teu Centro de Preparação  
        aos Exames de Admissão do Ensino Superior…
        Criado CE_Team
      </h1>
    </div>
  );
}
