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
  IonCheckbox,
  useIonToast,
  createAnimation,
  IonSpinner,
  IonRouterLink
} from '@ionic/react';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline, personOutline, logoGoogle, logoApple } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useIonViewDidEnter } from '@ionic/react';
import './signup.css';
import { signUp } from '../../apis/auth';
import { checkValidEmail } from '../../utils/confirmEmailType';

const SignUp: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  
  // Refs for animation
  const headerRef = useRef<HTMLIonTextElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLIonCardElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLDivElement>(null);
  const confirmPasswordRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLIonButtonElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const signinRef = useRef<HTMLDivElement>(null);

  // Run animations when view enters
  useIonViewDidEnter(() => {
    runAnimations();
  });

  const runAnimations = () => {
    // Logo animation
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

    // Name input animation
    if (nameRef.current) {
      createAnimation()
        .addElement(nameRef.current)
        .duration(500)
        .delay(500)
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateX(-20px)', 'translateX(0px)')
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

    // Confirm Password input animation
    if (confirmPasswordRef.current) {
      createAnimation()
        .addElement(confirmPasswordRef.current)
        .duration(500)
        .delay(800)
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

    // Sign in prompt animation
    if (signinRef.current) {
      createAnimation()
        .addElement(signinRef.current)
        .duration(500)
        .delay(1100)
        .fromTo('opacity', '0', '1')
        .easing('ease-out')
        .play();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const [showToast] = useIonToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkValidEmail(email)) {
      await showToast({
        message: 'Email is invalid',
        duration: 5000,
        color: "danger",
      })
      return;
    }
    
    if (password !== confirmPassword) {
      // alert('Passwords do not match');
      await showToast({
        message: 'Passwords do not match',
        duration: 5000,
        color: "danger",
      })
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(email, password, fullName);
      history.push('/signin');
      // alert("Check your email for verification!");
      await showToast({
        message: 'Check your email for verification!',
        duration: 5000,
        color: "warning",
      })
    } catch (error: any) {
      await showToast({
        message: error.message,
        duration: 5000,
        color: "danger",
      })
      // alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="signup-container">
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <div ref={logoRef} className="logo-container">
                  <img src='/logo/1.png' alt="Logo" className="logo-image" />
                </div>
                
                <IonText ref={headerRef} className="ion-text-center header-text">
                  <h1 className="welcome-title">Step into Greatness</h1>
                  {/* <p className="welcome-subtitle">Create your AlphaFlare account and begin your transformation</p> */}
                </IonText>

                <IonCard ref={cardRef} className="auth-card">
                  <IonCardContent>
                    <h2 className="card-title">Sign Up</h2>
                    
                    <form onSubmit={handleSignUp}>
                      <div ref={nameRef} className="input-container">
                        <IonLabel position="stacked">Full Name</IonLabel>
                        <div className="custom-input-wrapper">
                          <IonIcon icon={personOutline} className="input-icon" />
                          <IonInput
                            className="custom-input-signup"
                            type="text"
                            placeholder="Enter your full name"
                            value={fullName}
                            onIonInput={(e) => setFullName(e.detail.value!)}
                            required
                          />
                        </div>
                      </div>

                      <div ref={emailRef} className="input-container">
                        <IonLabel position="stacked">Email</IonLabel>
                        <div className="custom-input-wrapper">
                          <IonIcon icon={mailOutline} className="input-icon" />
                          <IonInput
                            className="custom-input-signup"
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
                            className="custom-input-signup"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
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

                      <div ref={confirmPasswordRef} className="input-container">
                        <IonLabel position="stacked">Confirm Password</IonLabel>
                        <div className="custom-input-wrapper">
                          <IonIcon icon={lockClosedOutline} className="input-icon" />
                          <IonInput
                            className="custom-input-signup"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onIonInput={(e) => setConfirmPassword(e.detail.value!)}
                            required
                          />
                          <IonIcon 
                            icon={showConfirmPassword ? eyeOffOutline : eyeOutline} 
                            className="toggle-password-icon"
                            onClick={toggleConfirmPasswordVisibility}
                          />
                        </div>
                      </div>

                      <IonButton
                        ref={buttonRef}
                        expand="block"
                        type="submit"
                        className="signup-button"
                        disabled={isLoading}
                      >
                        {isLoading ? <IonSpinner name="dots" /> : 'JOIN NOW'}
                      </IonButton>
                    </form>

                    {/* <div ref={dividerRef} className="divider">
                      <div className="line"></div>
                      <span className="or-text">Or sign up with</span>
                      <div className="line"></div>
                    </div>

                    <div className="social-buttons">
                      <IonButton className="google-button" fill="outline">
                        <IonIcon icon={logoGoogle} slot="start" />
                        Google
                      </IonButton>
                      
                      <IonButton className="apple-button" fill="outline">
                        <IonIcon icon={logoApple} slot="start" />
                        Apple
                      </IonButton>
                    </div> */}

                    <div ref={signinRef} className="signin-prompt" onClick={() => history.push('/signin')}>
                      <span>Already have an account? </span>
                      <strong>Sign In</strong>
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

export default SignUp;