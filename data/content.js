/* =====================================================================
   PBPC WEBSITE CONTENT  —  এই একটি ফাইল এডিট করলেই পুরো ওয়েবসাইট আপডেট হবে
   ---------------------------------------------------------------------
   HOW TO EDIT (on GitHub): open this file → click the pencil (✏️) icon →
   change the text between the quotes "..." → "Commit changes".
   The site updates itself in 1–2 minutes.

   RULES:
   • Keep the quotes " " and the commas , exactly as they are.
   • `draft: true` = sample/placeholder entry. It shows a yellow
     "Sample" badge on the site. Replace it with real, approved
     information and then delete the `draft: true` line.
   • Never publish names, dates, prices or photos that the
     Executive Committee has not approved.
   • Photos: upload into the folder shown (e.g. assets/photos/leaders/)
     and write the file name here.
   ===================================================================== */

window.PBPC = {

  /* ---------------- 1. ORGANIZATION SETTINGS ---------------- */
  settings: {
    name: "Pennsylvania Bangladesh Press Club",
    short: "PBPC",
    motto: "Truth | Responsibility | Community",
    email: "pabangladeshpressclub@gmail.com",
    location: "Pennsylvania, USA",
    website: "pabangladeshpressclub.github.io",

    social: {                              // leave "" to hide an icon
      facebook: "",
      youtube: "",
      x: "",
      instagram: ""
    },

    /* Membership application: create a Google Form and paste its link here.
       Until then, the Apply buttons open an email to the club address. */
    applicationFormUrl: "",

    /* Contact form: create a free form at https://formspree.io and paste the
       form endpoint here (looks like https://formspree.io/f/abcdwxyz).
       Until then, the contact form opens the visitor's email app instead. */
    contactFormEndpoint: "",

    /* Show sample (draft) entries on the website? Set to false once real
       information has been added, to hide anything still marked draft. */
    showDrafts: true
  },

  /* ---------------- 2. LEADERSHIP ----------------
     photo: put the image in assets/photos/leaders/ and write the file name.
     order: lower number shows first.                                   */
  leadership: [
    { id: "president", order: 1, draft: true,
      name: "Name to be added", nameBn: "নাম যুক্ত করা হবে",
      role: "President", roleBn: "সভাপতি",
      organization: "Media organization", photo: "",
      bio: "Short biography approved by the Executive Committee will appear here." },
    { id: "senior-vp", order: 2, draft: true,
      name: "Name to be added", nameBn: "নাম যুক্ত করা হবে",
      role: "Senior Vice President", roleBn: "সিনিয়র সহ-সভাপতি",
      organization: "Media organization", photo: "", bio: "" },
    { id: "vp", order: 3, draft: true,
      name: "Name to be added", nameBn: "নাম যুক্ত করা হবে",
      role: "Vice President", roleBn: "সহ-সভাপতি",
      organization: "Media organization", photo: "", bio: "" },
    { id: "gs", order: 4, draft: true,
      name: "Name to be added", nameBn: "নাম যুক্ত করা হবে",
      role: "General Secretary", roleBn: "সাধারণ সম্পাদক",
      organization: "Media organization", photo: "", bio: "" },
    { id: "js", order: 5, draft: true,
      name: "Name to be added", nameBn: "নাম যুক্ত করা হবে",
      role: "Joint Secretary", roleBn: "যুগ্ম সম্পাদক",
      organization: "Media organization", photo: "", bio: "" },
    { id: "treasurer", order: 6, draft: true,
      name: "Name to be added", nameBn: "নাম যুক্ত করা হবে",
      role: "Treasurer", roleBn: "কোষাধ্যক্ষ",
      organization: "Media organization", photo: "", bio: "" },
    { id: "org-sec", order: 7, draft: true,
      name: "Name to be added", nameBn: "নাম যুক্ত করা হবে",
      role: "Organizing Secretary", roleBn: "সাংগঠনিক সম্পাদক",
      organization: "Media organization", photo: "", bio: "" },
    { id: "pr-sec", order: 8, draft: true,
      name: "Name to be added", nameBn: "নাম যুক্ত করা হবে",
      role: "Public Relations Secretary", roleBn: "জনসংযোগ সম্পাদক",
      organization: "Media organization", photo: "", bio: "" }
  ],

  /* Messages shown on the Leadership page (leave text "" to hide). */
  messages: {
    president: { title: "President's Message", titleBn: "সভাপতির বার্তা", text: "" },
    generalSecretary: { title: "General Secretary's Message", titleBn: "সাধারণ সম্পাদকের বার্তা", text: "" }
  },

  /* ---------------- 3. MEMBERSHIP CATEGORIES ----------------
     fee: write the approved amount, e.g. "$25". Leave "" to show "To be announced".
     period: "per year" or "one time".                                       */
  membership: [
    { name: "Regular Member", nameBn: "সাধারণ সদস্য", fee: "", period: "per year", periodBn: "প্রতি বছর",
      eligibility: "Working journalists and media professionals of Bangladeshi origin living in Pennsylvania.",
      eligibilityBn: "পেনসিলভানিয়ায় বসবাসরত বাংলাদেশি বংশোদ্ভূত কর্মরত সাংবাদিক ও গণমাধ্যমকর্মী।" },
    { name: "Life Member", nameBn: "আজীবন সদস্য", fee: "", period: "one time", periodBn: "এককালীন",
      eligibility: "Regular members who wish to support PBPC with a one-time lifetime membership.",
      eligibilityBn: "যেসব সাধারণ সদস্য এককালীন আজীবন সদস্যপদ নিয়ে PBPC-কে সহায়তা করতে চান।", featured: true },
    { name: "Student Member", nameBn: "ছাত্র সদস্য", fee: "", period: "per year", periodBn: "প্রতি বছর",
      eligibility: "Students of journalism, communication or media studies.",
      eligibilityBn: "সাংবাদিকতা, যোগাযোগ বা গণমাধ্যম বিষয়ে অধ্যয়নরত শিক্ষার্থী।" }
  ],

  /* ---------------- 4. EVENTS ----------------
     date format: "2026-11-15" (year-month-day). Leave "" if not fixed yet.
     image: put the file in assets/photos/events/                          */
  events: [
    { id: "agm", draft: true,
      title: "Annual General Meeting", titleBn: "বার্ষিক সাধারণ সভা",
      date: "", time: "To be announced", venue: "Venue to be announced",
      image: "", registrationUrl: "",
      description: "Date, time and venue will be published after approval by the Executive Committee." }
  ],

  /* ---------------- 5. NEWS & UPDATES ----------------
     category: Announcement, Organizational News, Member Achievement,
               Press Release, Events & Activities, Community News
     Write the article in `body`. Start a new paragraph with \n\n          */
  news: [
    { id: "website-launch", draft: true,
      title: "PBPC launches its official website",
      titleBn: "PBPC-এর অফিসিয়াল ওয়েবসাইট চালু",
      date: "2026-11-06", category: "Announcement", author: "PBPC",
      image: "",
      summary: "The Pennsylvania Bangladesh Press Club now has an official website for news, events and membership.",
      body: "The Pennsylvania Bangladesh Press Club now has an official website. Here you will find club announcements, upcoming programs, photos from our events and information on how to become a member.\n\nPlease review this sample article and replace it with the official announcement approved by the Executive Committee." }
  ],

  /* ---------------- 6. MEMBERS DIRECTORY ----------------
     Only add members who have agreed to be listed publicly.
     Do NOT add phone numbers or home addresses.                         */
  members: [
    { id: "sample-1", draft: true, name: "Member name", city: "Philadelphia, PA",
      organization: "Media organization", designation: "Journalist", photo: "" },
    { id: "sample-2", draft: true, name: "Member name", city: "Upper Darby, PA",
      organization: "Media organization", designation: "Reporter", photo: "" },
    { id: "sample-3", draft: true, name: "Member name", city: "Allentown, PA",
      organization: "Media organization", designation: "Photojournalist", photo: "" },
    { id: "sample-4", draft: true, name: "Member name", city: "Pittsburgh, PA",
      organization: "Media organization", designation: "Content Creator", photo: "" }
  ],

  /* ---------------- 7. PHOTO GALLERY ----------------
     1) Create a folder inside assets/photos/gallery/  (e.g. agm-2026)
     2) Upload photos into it
     3) Add an album below listing the file names.
     Use only real PBPC photos you have permission to publish.          */
  gallery: [
    /* EXAMPLE — remove the slash-star marks to use:
    { album: "Annual General Meeting 2026", category: "Annual General Meetings",
      date: "2026-11-15", folder: "agm-2026",
      photos: [
        { file: "photo1.jpg", caption: "Opening session" },
        { file: "photo2.jpg", caption: "Members at the meeting" }
      ] },
    */
  ],

  /* ---------------- 8. PRESS ID VERIFICATION ----------------
     Only list IDs officially issued by PBPC. Public info only.
     status: "valid" or "revoked".  expires: "2027-12-31"                */
  credentials: [
    /* { id: "PBPC-2026-001", name: "Full Name", designation: "Reporter",
         status: "valid", expires: "2027-12-31" }, */
  ]
};
