import { FilePenLineIcon, ShieldCheckIcon, WalletIcon } from "lucide-react";
import './home_style.css'
import { Link } from "@tanstack/react-router";

export function HeroSection() {
  return (

    <div className="landpagex">
      <div className="dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] landscape">

        <div className="textLeft">

          <div className='innerText'>
            <h1>
              Fitness at your
              <span className='emphasy'>
                fingertips :)
              </span>
            </h1>
            <p>
              Meet Nora-Health, the AI-powered app for easy body workout and meal planner. describe the body build you want and nora-health will recommend the best workout session and meals for you.
            </p><br />

            <Link to='/about'>
              <button className='lpButton'>get started</button>
            </Link>
          </div>
        </div>


        <div className="imageRight">
          <img src="/A11.png " alt="norahealth nora-health" />
        </div>

      </div>
    </div>
  );
}
