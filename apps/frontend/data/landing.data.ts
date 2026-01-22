import dashboardImg from "@/assets/imgs/dashboard.png";

export const landingPageData = {
  cta: "launch app",
  appLink: "https://farcaster.xyz/miniapps/fpRdWmJY64fQ/nora-health",
  hero: {
    title: "Focus On What Really Matters Creating",
    desc: "nora-health helps creators automate posts and grow on The Base App and Farcaster.",
    img: dashboardImg,
  },
  about: {
    title: "About nora-health",
    desc: "nora-health is an onchain social automator that let's you schedule your post on farcaster and the base app",
    stats: [
      {
        title: "Users",
        value: 140,
      },
      {
        title: "Hours Saved",
        value: 10,
      },
      {
        title: "Post Scheduled",
        value: 30,
      },
      {
        title: "earned by creators",
        value: 30,
        currency: "$",
      },
    ],
  },
  tryout: {
    title: "Try nora-health Now",
    desc: "See you on the inside",
  },
};
