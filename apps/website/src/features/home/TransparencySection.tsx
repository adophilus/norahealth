import React from 'react';
import { RiMobileDownloadLine } from "react-icons/ri";
import { LuListTodo } from "react-icons/lu";
import { IoRocket } from "react-icons/io5";
import './howtouse.css';

export const TransparencySection = () => {
  const noraStepsData = [
    {
      id: 1,
      stepNumber: "01",
      title: "Download & Register",
      description: "Download the NoraHealth app from Google Play or App Store. Create your account and set up your wellness profile in minutes.",
      icon: <RiMobileDownloadLine />
    },
    {
      id: 2,
      stepNumber: "02",
      title: "Set Your Goals",
      description: "Tell Nora about your health goals, dietary preferences, allergies, and fitness level. Our AI agents customize your plan instantly.",
      icon: <LuListTodo />
    },
    {
      id: 3,
      stepNumber: "03",
      title: "Start Your Journey",
      description: "Receive personalized meal plans, weather-adaptive workouts, and AI-powered guidance. Track progress and achieve your wellness goals.",
      icon: <IoRocket />
    }
  ];

  return (
    <section className='nora-howto-wrapper'>
      <div className="nora-howto-container">
        {/* Header Section */}
        <div className="nora-howto-header">
          <div className="nora-howto-label">
            <span>HOW TO USE</span>
          </div>
          <h2 className="nora-howto-title">Simple, secure, and convenient</h2>
          <p className="nora-howto-subtitle">Get the wellness care you need in three easy steps.</p>
        </div>

        {/* Steps Grid */}
        <div className="nora-steps-grid">
          {/* Connection Line - Desktop Only */}
          <div className="nora-steps-connector"></div>

          {noraStepsData.map(({ id, stepNumber, title, description, icon }) => (
            <div className="nora-step-card" key={id}>
              <div className="nora-step-icon-wrapper">
                <div className="nora-step-icon-box">
                  <div className="nora-step-icon">
                    {icon}
                  </div>
                </div>
                <div className="nora-step-badge">{stepNumber}</div>
              </div>
              <h3 className="nora-step-title">{title}</h3>
              <p className="nora-step-description">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};