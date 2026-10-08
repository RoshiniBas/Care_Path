import os
import json
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from google import genai
from coimbatore_hospitals import COIMBATORE_HOSPITALS


# --------------------------------------------------
# CAREPATH TOOL
# --------------------------------------------------

def find_specialists(specialty: str):
    specialists = {
    "Dermatology": [
        {
            "name": "Dr. Meera Krishnan",
            "facility": "HealthFirst Medical Centre",
            "location": "North Avenue",
            "availability": "Available today",
        },
        {
            "name": "Dr. Nithin Raj",
            "facility": "CarePoint Multispeciality Hospital",
            "location": "Central City",
            "availability": "Available tomorrow",
        },
    ],

    "Cardiology": [
        {
            "name": "Dr. Priya Sharma",
            "facility": "CarePoint Multispeciality Hospital",
            "location": "Central City",
            "availability": "Available today",
        },
        {
            "name": "Dr. Arjun Mehta",
            "facility": "Wellness Care Hospital",
            "location": "East District",
            "availability": "Available tomorrow",
        },
    ],

    "Orthopedics": [
        {
            "name": "Dr. Rahul Menon",
            "facility": "CarePoint Multispeciality Hospital",
            "location": "Central City",
            "availability": "Available today",
        },
        {
            "name": "Dr. Sneha Iyer",
            "facility": "Wellness Care Hospital",
            "location": "East District",
            "availability": "Available tomorrow",
        },
    ],

    "Pediatrics": [
        {
            "name": "Dr. Kavya Nair",
            "facility": "Wellness Care Hospital",
            "location": "East District",
            "availability": "Available today",
        },
        {
            "name": "Dr. Rohan Thomas",
            "facility": "CarePoint Multispeciality Hospital",
            "location": "Central City",
            "availability": "Available tomorrow",
        },
    ],

    "Neurology": [
        {
            "name": "Dr. Vivek Shah",
            "facility": "Wellness Care Hospital",
            "location": "East District",
            "availability": "Available today",
        },
        {
            "name": "Dr. Divya Raman",
            "facility": "CarePoint Multispeciality Hospital",
            "location": "Central City",
            "availability": "Available tomorrow",
        },
    ],
}
    return specialists.get(specialty, [])

def find_facilities(facility_type: str):
    if facility_type == "Hospital":
        hospitals = []

        for hospital in COIMBATORE_HOSPITALS:
            hospitals.append({
                "name": hospital["name"],
                "type": hospital["type"],
                "distance": "Nearby",
                "location": hospital["area"],
                "open": "Open 24 hours" if hospital["open_24_hours"] else "Check availability",
                "specialties": " • ".join(hospital["specialties"]),
                "address": hospital["address"],
                "phone": hospital["phone"],
                "emergency": hospital["emergency"],
                "position": (
                    [hospital["latitude"], hospital["longitude"]]
                    if hospital["latitude"] is not None
                    and hospital["longitude"] is not None
                    else None
                ),
            })

        return hospitals

    if facility_type == "Clinic":
        return [
            {
                "name": "HealthFirst Medical Centre",
                "type": "Clinic",
                "distance": "2.4 km",
                "location": "North Avenue",
                "open": "Open until 9:00 PM",
                "specialties": "General Medicine • Dermatology",
                "emergency": False,
                "position": [10.7972, 78.6851],
            }
        ]

    if facility_type == "Emergency":
        hospitals = []

        for hospital in COIMBATORE_HOSPITALS:
            if hospital["emergency"]:
                hospitals.append({
                    "name": hospital["name"],
                    "type": hospital["type"],
                    "distance": "Nearby",
                    "location": hospital["area"],
                    "open": "Open 24 hours"
                    if hospital["open_24_hours"]
                    else "Check availability",
                    "specialties": " • ".join(hospital["specialties"]),
                    "emergency": True,
                    "position": (
                        [hospital["latitude"], hospital["longitude"]]
                        if hospital["latitude"] is not None
                        and hospital["longitude"] is not None
                        else None
                    ),
                })

        return hospitals

    return []

def get_facility_details(facility_name: str):
    facilities = {
        "CarePoint Multispeciality Hospital": {
            "name": "CarePoint Multispeciality Hospital",
            "type": "Hospital",
            "location": "Central City",
            "open": "Open 24 hours",
            "specialties": "General Medicine • Cardiology • Orthopedics",
            "emergency": True,
            "distance": "1.8 km",
        },
        "HealthFirst Medical Centre": {
            "name": "HealthFirst Medical Centre",
            "type": "Clinic",
            "location": "North Avenue",
            "open": "Open until 9:00 PM",
            "specialties": "General Medicine • Dermatology",
            "emergency": False,
            "distance": "2.4 km",
        },
        "Wellness Care Hospital": {
            "name": "Wellness Care Hospital",
            "type": "Hospital",
            "location": "East District",
            "open": "Open 24 hours",
            "specialties": "Pediatrics • Neurology • General Medicine",
            "emergency": True,
            "distance": "3.1 km",
        },
    }

    return facilities.get(facility_name)

def check_availability(specialty: str):
    availability = {
        "Dermatology": [
            {
                "doctor": "Dr. Meera Krishnan",
                "facility": "HealthFirst Medical Centre",
                "date": "Today",
                "times": ["10:00 AM", "2:00 PM", "5:00 PM"],
            },
            {
                "doctor": "Dr. Nithin Raj",
                "facility": "CarePoint Multispeciality Hospital",
                "date": "Tomorrow",
                "times": ["9:00 AM", "11:00 AM", "4:00 PM"],
            },
        ],
        "Cardiology": [
            {
                "doctor": "Dr. Priya Sharma",
                "facility": "CarePoint Multispeciality Hospital",
                "date": "Today",
                "times": ["10:00 AM", "3:00 PM"],
            },
            {
                "doctor": "Dr. Arjun Mehta",
                "facility": "Wellness Care Hospital",
                "date": "Tomorrow",
                "times": ["11:00 AM", "2:00 PM"],
            },
        ],
    }

    return availability.get(specialty, [])

def request_appointment(
    doctor: str,
    facility: str,
    date: str,
    time: str,
    patient_name: str,
):
    return {
        "status": "appointment_requested",
        "doctor": doctor,
        "facility": facility,
        "date": date,
        "time": time,
        "patient_name": patient_name,
        "message": "Appointment request created successfully.",
    }

def get_directions(facility_name: str):
    directions = {
        "CarePoint Multispeciality Hospital": {
            "facility": "CarePoint Multispeciality Hospital",
            "location": "Central City",
            "distance": "1.8 km",
            "estimated_time": "8 minutes",
            "directions": "Head toward Central City via Main Road."
        },
        "HealthFirst Medical Centre": {
            "facility": "HealthFirst Medical Centre",
            "location": "North Avenue",
            "distance": "2.4 km",
            "estimated_time": "11 minutes",
            "directions": "Head north toward North Avenue via Central Road."
        },
        "Wellness Care Hospital": {
            "facility": "Wellness Care Hospital",
            "location": "East District",
            "distance": "3.1 km",
            "estimated_time": "14 minutes",
            "directions": "Head east toward East District via Riverside Road."
        },
    }

    return directions.get(facility_name)

def find_emergency_facility():
    return [
        {
            "name": "CarePoint Multispeciality Hospital",
            "location": "Central City",
            "open": "Open 24 hours",
            "distance": "1.8 km",
            "emergency": True,
        },
        {
            "name": "Wellness Care Hospital",
            "location": "East District",
            "open": "Open 24 hours",
            "distance": "3.1 km",
            "emergency": True,
        },
    ]
# --------------------------------------------------
# LOAD ENVIRONMENT
# --------------------------------------------------

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError("GEMINI_API_KEY was not found in .env")


# --------------------------------------------------
# GEMINI CLIENT
# --------------------------------------------------

client = genai.Client(api_key=api_key)


# --------------------------------------------------
# FASTAPI
# --------------------------------------------------

app = FastAPI(title="CarePath API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# REQUEST MODEL
# --------------------------------------------------

class ChatRequest(BaseModel):
    message: str


# --------------------------------------------------
# GEMINI TOOL DEFINITION
# --------------------------------------------------

find_specialists_tool = {
    "type": "function",
    "name": "find_specialists",
    "description": (
        "Find medical specialists available for a specific medical "
        "specialty. Use this when the user wants to find a doctor "
        "or specialist."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "specialty": {
                "type": "string",
                "description": (
                    "The medical specialty the user is looking for, "
                    "such as Dermatology or Cardiology."
                ),
            }
        },
        "required": ["specialty"],
    },
}

find_facilities_tool = {
    "type": "function",
    "name": "find_facilities",
    "description": (
        "Find healthcare facilities such as hospitals, clinics, "
        "or emergency care facilities."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "facility_type": {
                "type": "string",
                "description": (
                    "The type of facility the user wants: "
                    "Hospital, Clinic, or Emergency."
                ),
                "enum": [
                    "Hospital",
                    "Clinic",
                    "Emergency",
                ],
            }
        },
        "required": ["facility_type"],
    },
}

get_facility_details_tool = {
    "type": "function",
    "name": "get_facility_details",
    "description": (
        "Get detailed information about a specific healthcare facility."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "facility_name": {
                "type": "string",
                "description": (
                    "The exact name of the healthcare facility."
                ),
            }
        },
        "required": ["facility_name"],
    },
}

check_availability_tool = {
    "type": "function",
    "name": "check_availability",
    "description": (
        "Check available appointment times for a medical specialty."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "specialty": {
                "type": "string",
                "description": (
                    "The medical specialty to check availability for, "
                    "such as Dermatology or Cardiology."
                ),
            }
        },
        "required": ["specialty"],
    },
}

request_appointment_tool = {
    "type": "function",
    "name": "request_appointment",
    "description": (
        "Create an appointment request after the user has explicitly "
        "confirmed the doctor, facility, date, and time."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "doctor": {
                "type": "string",
                "description": "The selected doctor's name.",
            },
            "facility": {
                "type": "string",
                "description": "The healthcare facility.",
            },
            "date": {
                "type": "string",
                "description": "The requested appointment date.",
            },
            "time": {
                "type": "string",
                "description": "The requested appointment time.",
            },
            "patient_name": {
                "type": "string",
                "description": "The patient's name.",
            },
        },
        "required": [
            "doctor",
            "facility",
            "date",
            "time",
            "patient_name",
        ],
    },
}

get_directions_tool = {
    "type": "function",
    "name": "get_directions",
    "description": (
        "Get directions and estimated travel time to a healthcare facility."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "facility_name": {
                "type": "string",
                "description": "The healthcare facility to navigate to.",
            }
        },
        "required": ["facility_name"],
    },
}

find_emergency_facility_tool = {
    "type": "function",
    "name": "find_emergency_facility",
    "description": (
        "Find healthcare facilities that provide emergency care. "
        "Use this when the user describes or asks about an emergency "
        "and needs urgent healthcare navigation."
    ),
    "parameters": {
        "type": "object",
        "properties": {},
    },
}

# --------------------------------------------------
# ROOT
# --------------------------------------------------

@app.get("/")
def root():
    return {"message": "CarePath API is running"}


# --------------------------------------------------
# CHAT
# --------------------------------------------------

@app.post("/chat")
def chat(request: ChatRequest):

    print("🔥 CAREPATH AGENT")
    print("🔥 USER MESSAGE:", request.message)

    system_prompt = """
You are CarePath, the AI healthcare navigation assistant inside
the CarePath application.

You are NOT a general-purpose AI assistant.

Your job is to help users navigate healthcare services.

CarePath can help users:
- Find hospitals and clinics
- Find medical specialists
- Get healthcare facility information
- Plan or request appointments
- Get directions
- Find emergency healthcare facilities

You are NOT a doctor.

Do not:
- Diagnose medical conditions
- Prescribe medicines
- Recommend medical treatments

If the user describes a possible emergency, prioritize directing
them toward appropriate emergency medical care.
For users in India, always refer to emergency number 112.
Never mention 911.

IMPORTANT TOOL RULE:

When the user asks to find hospitals in Coimbatore,
use the find_facilities tool with facility_type "Hospital".

The Hospital results come from CarePath's verified Coimbatore
hospital dataset.

Do not invent hospital names, addresses, phone numbers,
specialties, availability, or distances.

When the user asks for emergency hospitals in Coimbatore,
use the find_facilities tool with facility_type "Emergency".

When the user asks to find a medical specialist or doctor,
use the find_specialists tool whenever appropriate.

For example:
- "I need a dermatologist" → use find_specialists with Dermatology
- "Find me a cardiologist" → use find_specialists with Cardiology

Do not invent doctors or specialist availability.

After receiving tool results, explain the relevant results
clearly and naturally to the user.

Be friendly, professional, concise, and easy to understand.
"""


    # --------------------------------------------------
    # FIRST GEMINI CALL
    # --------------------------------------------------

    interaction = client.interactions.create(
        model="gemini-3.5-flash-lite",

        input=f"""
{system_prompt}

USER MESSAGE:
{request.message}
""",

        tools=[find_specialists_tool,
               find_facilities_tool,
               get_facility_details_tool,
               check_availability_tool,
               request_appointment_tool,
               get_directions_tool,
               find_emergency_facility_tool],

        timeout=120,
    )

    # --------------------------------------------------
    # CHECK FOR TOOL CALL
    # --------------------------------------------------

    for step in interaction.steps:
        if step.type == "function_call":

            print("🧠 GEMINI DECIDED TO USE TOOL")
            print("🔧 TOOL:", step.name)
            print("📦 ARGUMENTS:", step.arguments)

            if step.name == "find_specialists":

                specialty = step.arguments["specialty"]

                print("🔎 SEARCHING FOR SPECIALISTS:", specialty)

                result = find_specialists(specialty)

            elif step.name == "find_facilities":

                        facility_type = step.arguments["facility_type"]

                        print("🏥 SEARCHING FOR FACILITIES:", facility_type)

                        result = find_facilities(facility_type)
            elif step.name == "get_facility_details":

                    facility_name = step.arguments["facility_name"]

                    print("🏥 GETTING FACILITY DETAILS:", facility_name)

                    result = get_facility_details(facility_name)

            elif step.name == "check_availability":

                specialty = step.arguments["specialty"]

                print("📅 CHECKING AVAILABILITY:", specialty)

                result = check_availability(specialty)

            elif step.name == "request_appointment":

                doctor = step.arguments["doctor"]
                facility = step.arguments["facility"]
                date = step.arguments["date"]
                time = step.arguments["time"]
                patient_name = step.arguments["patient_name"]

                print("📅 REQUESTING APPOINTMENT")
                print("👨‍⚕️ DOCTOR:", doctor)
                print("🏥 FACILITY:", facility)
                print("📆 DATE:", date)
                print("⏰ TIME:", time)

                result = request_appointment(
                    doctor,
                    facility,
                    date,
                    time,
                    patient_name,
                )
            elif step.name == "get_directions":
                facility_name = step.arguments["facility_name"]
                print("🗺️ GETTING DIRECTIONS TO:", facility_name)
                result = get_directions(facility_name)

            elif step.name == "find_emergency_facility":
                print("🚨 FINDING EMERGENCY FACILITIES")
                result = find_emergency_facility()
            else:
                        continue

            print("✅ TOOL RESULT:", result)
                # --------------------------------------------------
                # SEND TOOL RESULT BACK TO GEMINI
                # --------------------------------------------------

            final_interaction = client.interactions.create(
                    model="gemini-3.5-flash-lite",
                    previous_interaction_id=interaction.id,
                    input=[
                        {
                            "type": "function_result",
                            "name": step.name,
                            "call_id": step.id,
                            "result": json.dumps(result),
                        }
                    ],
                    timeout=120,
                )

            print("💬 GEMINI FINAL RESPONSE:")
            print(final_interaction.output_text)

            return {
                    "response": final_interaction.output_text,
                    "tool": step.name,
                    "tool_arguments": step.arguments,
                    "tool_result": result,

            }
#-------------------------------------
    # NORMAL RESPONSE
    # --------------------------------------------------

    return {
                "response": interaction.output_text,
                "tool": None,
    }