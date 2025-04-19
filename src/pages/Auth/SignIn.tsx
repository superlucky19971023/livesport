import React, { useState, useRef } from 'react';
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonCard,
  IonCardContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonToggle,
  IonSpinner,
  createAnimation,
  useIonToast,
  IonCheckbox,
  IonRouterLink
} from '@ionic/react';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, logoGoogle, logoApple } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useIonViewDidEnter } from '@ionic/react';
import './signin.css';
import { signIn } from '../../apis/auth';
import { supabase } from '../../utils/supabaseClient';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  // Refs for animation
  const logoRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLIonTextElement>(null);
  const cardRef = useRef<HTMLIonCardElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLIonButtonElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const signupRef = useRef<HTMLDivElement>(null);

  // Run animations when view enters
  useIonViewDidEnter(() => {
    runAnimations();
  });

  const runAnimations = () => {
    if (logoRef.current) {
      createAnimation()
        .addElement(logoRef.current)
        .duration(800)
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'scale(0.8)', 'scale(1)')
        .easing('ease-out')
        .play();
    }
    // Header animation
    if (headerRef.current) {
      createAnimation()
        .addElement(headerRef.current)
        .duration(800)
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(-30px)', 'translateY(0px)')
        .easing('ease-out')
        .play();
    }

    // Card animation
    if (cardRef.current) {
      createAnimation()
        .addElement(cardRef.current)
        .duration(600)
        .delay(300)
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'scale(0.9)', 'scale(1)')
        .easing('ease-out')
        .play();
    }

    // Email input animation
    if (emailRef.current) {
      createAnimation()
        .addElement(emailRef.current)
        .duration(500)
        .delay(600)
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateX(-20px)', 'translateX(0px)')
        .easing('ease-out')
        .play();
    }

    // Password input animation
    if (passwordRef.current) {
      createAnimation()
        .addElement(passwordRef.current)
        .duration(500)
        .delay(700)
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateX(-20px)', 'translateX(0px)')
        .easing('ease-out')
        .play();
    }

    // Button animation
    if (buttonRef.current) {
      createAnimation()
        .addElement(buttonRef.current)
        .duration(500)
        .delay(900)
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(20px)', 'translateY(0px)')
        .easing('ease-out')
        .play();
    }

    // Divider animation
    if (dividerRef.current) {
      createAnimation()
        .addElement(dividerRef.current)
        .duration(500)
        .delay(1000)
        .fromTo('opacity', '0', '1')
        .easing('ease-out')
        .play();
    }

    // Social buttons animation
    if (socialRef.current) {
      createAnimation()
        .addElement(socialRef.current)
        .duration(500)
        .delay(1100)
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(20px)', 'translateY(0px)')
        .easing('ease-out')
        .play();
    }

    // Signup prompt animation
    if (signupRef.current) {
      createAnimation()
        .addElement(signupRef.current)
        .duration(500)
        .delay(1200)
        .fromTo('opacity', '0', '1')
        .easing('ease-out')
        .play();
    }
  };
  const [showToast] = useIonToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);

      // history.push('/main');

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('No user found after sign in');
      }

      // Check payment status
      const { data: paymentData, error } = await supabase
        .from('payment')
        .select('status')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error checking payment status:', error);
        history.push('/payment');
        return;
      }

      // Redirect based on subscription status
      if (paymentData?.status === 'subscribed') {
        history.push('/main');
      } else {
        history.push('/payment');
      }
    } catch (error: any) {
      // alert(error.message);
      await showToast({
        message: error.message,
        duration: 5000,
        color: "danger",
      })
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <IonPage>
      <IonContent fullscreen >
        <div className="signin-container">
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <div ref={logoRef} className="logo-container">
                  <img src='/logo/1.png' alt="Logo" className="logo-image" />
                </div>
                <IonText ref={headerRef} className="ion-text-center header-text">
                  <h1 className="welcome-title">Welcome Back, Leader</h1>
                  {/* <p className="welcome-subtitle">Forge Ahead - Your Path Awaits</p> */}
                </IonText>

                <IonCard ref={cardRef} className="auth-card">
                  <IonCardContent>
                    <h2 className="card-title">Sign In</h2>

                    <form onSubmit={handleSignIn}>
                      <div ref={emailRef} className="input-container">
                        <IonLabel position="stacked">Email</IonLabel>
                        <div className="custom-input-wrapper">
                          <IonIcon icon={mailOutline} className="input-icon" />
                          <IonInput
                            className="custom-input-signin"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onIonInput={(e) => setEmail(e.detail.value!)}
                            required
                          />
                        </div>
                      </div>

                      <div ref={passwordRef} className="input-container">
                        <IonLabel position="stacked">Password</IonLabel>
                        <div className="custom-input-wrapper">
                          <IonIcon icon={lockClosedOutline} className="input-icon" />
                          <IonInput
                            className="custom-input-signin"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onIonInput={(e) => setPassword(e.detail.value!)}
                            required
                          />
                          <IonIcon
                            icon={showPassword ? eyeOffOutline : eyeOutline}
                            className="toggle-password-icon"
                            onClick={togglePasswordVisibility}
                          />
                        </div>
                      </div>

                      <div className="form-options">
                        {/* <IonItem lines="none" className="remember-me">
                          <IonCheckbox
                            slot="start"
                            checked={rememberMe}
                            onIonChange={e => setRememberMe(e.detail.checked)}
                          />
                          <IonLabel className="forgot-password">Remember me</IonLabel>
                        </IonItem> */}

                        {/* <IonRouterLink routerLink="/forgot-password" className="forgot-password">
                          Forgot Password?
                        </IonRouterLink> */}
                      </div>

                      <IonButton
                        ref={buttonRef}
                        expand="block"
                        type="submit"
                        className="signin-button"
                        disabled={isLoading}
                      >
                        {isLoading ? <IonSpinner name="dots" /> : 'SIGN IN'}
                      </IonButton>
                    </form>
                    {/* 
                    <div ref={dividerRef} className="divider">
                      <div className="line"></div>
                      <span className="or-text">Or continue with</span>
                      <div className="line"></div>
                    </div>

                    <div ref={socialRef} className="social-buttons">
                      <IonButton className="google-button" fill="outline">
                        <IonIcon icon={logoGoogle} slot="start" />
                        Google
                      </IonButton>
                      
                      <IonButton className="apple-button" fill="outline">
                        <IonIcon icon={logoApple} slot="start" />
                        Apple
                      </IonButton>
                    </div> */}

                    <div ref={signupRef} className="signup-prompt" onClick={() => history.push('/signup')}>
                      <span>New here? </span>
                      <strong>Create Account</strong>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignIn;