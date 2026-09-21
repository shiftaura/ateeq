const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

// Load backend .env
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const Doctor = require("../models/Doctor");
const User = require("../models/User");

// Generate realistic next 7-day schedule slots (e.g. 2026-09-22 to 2026-09-28)
function generateSlotsForUpcomingDays() {
  const dates = [];
  const today = new Date("2026-09-22");

  const standardTimes = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];

    dates.push({
      date: dateStr,
      slots: standardTimes.map((time, idx) => ({
        time,
        isBooked: idx === 1 && i === 0, // Mark one slot booked as realistic example
      })),
    });
  }

  return dates;
}

const mockDoctors = [
  {
    name: "Dr. Sarah Jenkins",
    email: "dr.sarah.jenkins@mediconsult-demo.org",
    specialization: "General Physician",
    qualification: "MBBS, MD (Internal Medicine)",
    experience: 12,
    about:
      "Board-certified internal medicine physician with over 12 years of clinical experience in preventative care, chronic symptom management, and holistic lifestyle wellness.",
    profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
    clinic: {
      name: "MediConsult Health Center",
      address: "104 Healthcare Boulevard, Suite 201",
      city: "San Francisco, CA",
    },
    phone: "+1 (555) 234-5671",
    isAvailable: true,
  },
  {
    name: "Dr. Marcus Vance",
    email: "dr.marcus.vance@mediconsult-demo.org",
    specialization: "Cardiologist",
    qualification: "MD, FACC (Cardiology)",
    experience: 16,
    about:
      "Senior clinical cardiologist specializing in preventive cardiovascular care, hypertension management, arrhythmia diagnosis, and comprehensive heart health evaluation.",
    profileImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
    clinic: {
      name: "Heart & Vascular Institute",
      address: "450 Cardiogram Ave, 3rd Floor",
      city: "Boston, MA",
    },
    phone: "+1 (555) 345-6782",
    isAvailable: true,
  },
  {
    name: "Dr. Elena Rostova",
    email: "dr.elena.rostova@mediconsult-demo.org",
    specialization: "Dermatologist",
    qualification: "MD, FAAD (Dermatology)",
    experience: 9,
    about:
      "Specialist in medical dermatology, acute allergic rashes, eczema, acne therapies, and preventative skin cancer screenings.",
    profileImage: "https://images.unsplash.com/photo-1594824813575-68ff37800c28?auto=format&fit=crop&q=80&w=400",
    clinic: {
      name: "DermaCare Specialty Clinic",
      address: "88 Beacon Street, Suite 10",
      city: "New York, NY",
    },
    phone: "+1 (555) 456-7893",
    isAvailable: true,
  },
  {
    name: "Dr. David Kim",
    email: "dr.david.kim@mediconsult-demo.org",
    specialization: "Pediatrician",
    qualification: "MD, FAAP (Pediatrics)",
    experience: 11,
    about:
      "Compassionate pediatrician dedicated to infant, child, and adolescent healthcare, childhood infections, nutritional growth, and preventative immunizations.",
    profileImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
    clinic: {
      name: "Sunshine Children's Wellness",
      address: "312 Meadow Lane, Building B",
      city: "Seattle, WA",
    },
    phone: "+1 (555) 567-8904",
    isAvailable: true,
  },
  {
    name: "Dr. Rachel Greenburg",
    email: "dr.rachel.greenburg@mediconsult-demo.org",
    specialization: "ENT Specialist",
    qualification: "MS, DLO (Otolaryngology)",
    experience: 14,
    about:
      "Expert otolaryngologist handling chronic sinus conditions, allergy-induced nasal airway obstruction, hearing disorders, and throat infections.",
    profileImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400",
    clinic: {
      name: "Metro Ear, Nose & Throat Clinic",
      address: "500 Grand Ave, Suite 400",
      city: "Chicago, IL",
    },
    phone: "+1 (555) 678-9015",
    isAvailable: true,
  },
  {
    name: "Dr. Arthur Pendelton",
    email: "dr.arthur.pendelton@mediconsult-demo.org",
    specialization: "Neurologist",
    qualification: "MD, DM (Neurology)",
    experience: 20,
    about:
      "Distinguished neurologist focusing on chronic migraine management, neuropathy, central nervous system diagnostics, and sleep disorder therapies.",
    profileImage: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400",
    clinic: {
      name: "NeuroScience Care Pavilion",
      address: "700 Innovation Way, Suite 8A",
      city: "Austin, TX",
    },
    phone: "+1 (555) 789-0126",
    isAvailable: true,
  },
  {
    name: "Dr. Maya Patel",
    email: "dr.maya.patel@mediconsult-demo.org",
    specialization: "Gynecologist",
    qualification: "MD, DGO, FACOG (Obstetrics & Gynecology)",
    experience: 15,
    about:
      "Empathetic practitioner supporting women's reproductive health, prenatal guidance, hormonal imbalances, and preventive wellness checkups.",
    profileImage: "https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?auto=format&fit=crop&q=80&w=400",
    clinic: {
      name: "Horizon Women's Health Clinic",
      address: "245 Blossom Hill Road",
      city: "San Jose, CA",
    },
    phone: "+1 (555) 890-1237",
    isAvailable: true,
  },
  {
    name: "Dr. Christopher Cole",
    email: "dr.christopher.cole@mediconsult-demo.org",
    specialization: "Orthopedic",
    qualification: "MS (Orthopedics), MCh",
    experience: 13,
    about:
      "Orthopedic clinician specializing in joint mobility, musculoskeletal sports injuries, spinal posture alignment, and rehabilitation therapies.",
    profileImage: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400",
    clinic: {
      name: "Apex Bone & Joint Medical Center",
      address: "1200 Olympic Boulevard, Suite 500",
      city: "Denver, CO",
    },
    phone: "+1 (555) 901-2348",
    isAvailable: true,
  },
  {
    name: "Dr. Ananya Iyer",
    email: "dr.ananya.iyer@mediconsult-demo.org",
    specialization: "General Physician",
    qualification: "MBBS, DNB (Family Medicine)",
    experience: 8,
    about:
      "Passionate family medicine physician delivering comprehensive primary care, viral illness management, preventive screenings, and patient education.",
    profileImage: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&q=80&w=400",
    clinic: {
      name: "Community Health Partners",
      address: "65 University Ave, Suite 102",
      city: "Philadelphia, PA",
    },
    phone: "+1 (555) 012-3459",
    isAvailable: true,
  },
  {
    name: "Dr. Jonathan Reyes",
    email: "dr.jonathan.reyes@mediconsult-demo.org",
    specialization: "Dermatologist",
    qualification: "MD (Dermatology, Venereology & Leprosy)",
    experience: 10,
    about:
      "Dedicated clinical dermatologist with expertise in allergic contact dermatitis, fungal skin conditions, laser therapeutics, and cosmetic skin pathology.",
    profileImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400",
    clinic: {
      name: "Pacific Skin & Aesthetic Clinic",
      address: "800 Coastal Highway, Suite 300",
      city: "San Diego, CA",
    },
    phone: "+1 (555) 123-4560",
    isAvailable: true,
  },
];

async function seedDatabase() {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mediconsult";

  try {
    console.log(`[Seed] Connecting to MongoDB at: ${mongoUri.replace(/:([^:@]{4})[^:@]*@/, ":****@")}`);
    await mongoose.connect(mongoUri);
    console.log("[Seed] Database connected successfully.");

    // Clear existing doctors to ensure clean repeatable seeding
    const deleted = await Doctor.deleteMany({});
    console.log(`[Seed] Cleared ${deleted.deletedCount} existing doctor records.`);

    // Attach schedules to doctors
    const doctorsWithSchedule = mockDoctors.map((doc) => ({
      ...doc,
      availability: generateSlotsForUpcomingDays(),
    }));

    const inserted = await Doctor.insertMany(doctorsWithSchedule);
    console.log(`[Seed] Successfully inserted ${inserted.length} fictional doctor profiles across 8 specializations!`);

    // Ensure an Admin User exists for testing
    const adminEmail = "admin@mediconsult.local";
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: "MediConsult Administrator",
        email: adminEmail,
        password: "AdminPassword123!",
        phone: "+1 (555) 000-0001",
        dateOfBirth: "1988-05-15",
        gender: "other",
        role: "admin",
      });
      console.log(`[Seed] Default Admin account created: ${adminEmail} (password: AdminPassword123!)`);
    } else {
      console.log(`[Seed] Admin account already exists: ${adminEmail}`);
    }

    console.log("\n[Seed] Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("[Seed] Error during seeding:", error.message);
    process.exit(1);
  }
}

seedDatabase();
